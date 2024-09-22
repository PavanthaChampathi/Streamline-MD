const fs = require('fs');
const path = require('path');
const axios = require('axios');
const config = require('../config');

const GITHUB_TOKEN = config.GITHUB_TOKEN;
const GITHUB_USERNAME = config.GITHUB_USERNAME;
const REPO_NAME = 'Streamline-MD-Database';
const BASE_DIR = '../database';
const GITHUB_API_URL = 'https://api.github.com/user/repos';

async function repoExists(repoName) {
  try {
    const response = await axios.get(GITHUB_API_URL, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const repos = response.data;
    return repos.some(repo => repo.name === repoName);
  } catch (error) {
    console.error(`Error checking repository existence: ${error.message}`);
    return false;
  }
}

async function fileExists(repoFullName, filePath) {
  try {
    const response = await axios.get(`https://api.github.com/repos/${repoFullName}/contents/${filePath}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    return response.status === 200;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false;
    }
    console.error(`Error checking file existence: ${error.message}`);
    return false;
  }
}

async function uploadFile(repoFullName, filePath, content) {
  try {
    const response = await axios.put(
      `https://api.github.com/repos/${repoFullName}/contents/${filePath}`,
      {
        message: `Add ${filePath}`,
        content: Buffer.from(content).toString('base64'),
      },
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    console.log(`File uploaded: ${response.data.content.html_url}`);
  } catch (error) {
    if (error.response) {
      console.error(`Error uploading file: ${error.response.status} - ${error.response.data.message}`);
    } else {
      console.error(`Error uploading file: ${error.message}`);
    }
  }
}

async function uploadDirectory(repoFullName, dirPath, baseDir = '') {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const repoFilePath = path.join(baseDir, path.relative(BASE_DIR, filePath)).replace(/\\/g, '/');

    if (fs.statSync(filePath).isDirectory()) {
      await uploadDirectory(repoFullName, filePath, repoFilePath);
    } else {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      await uploadFile(repoFullName, repoFilePath, fileContent);
    }
  }
}

async function createRepo() {
  try {
    const exists = await repoExists(REPO_NAME);
    if (exists) {
      console.log(`Repository already exists: ${REPO_NAME}`);
      const repoFullName = `${GITHUB_USERNAME}/${REPO_NAME}`;
      const readmeExists = await fileExists(repoFullName, 'README.md');
      if (!readmeExists) {
        await createReadMeFile(repoFullName);
      }
      await uploadDirectory(repoFullName, BASE_DIR);
      return;
    }

    const response = await axios.post(
      GITHUB_API_URL,
      {
        name: REPO_NAME,
        private: true,
      },
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    console.log(`Repository created: ${response.data.html_url}`);
    const repoFullName = `${GITHUB_USERNAME}/${REPO_NAME}`;
    await createReadMeFile(repoFullName);
    await uploadDirectory(repoFullName, BASE_DIR);

  } catch (error) {
    if (error.response) {
      console.error(`Error creating repository: ${error.response.status} - ${error.response.data.message}`);
    } else {
      console.error(`Error creating repository: ${error.message}`);
    }
  }
}

async function createReadMeFile(repoFullName) {
  try {
    const response = await axios.put(
      `https://api.github.com/repos/${repoFullName}/contents/README.md`,
      {
        message: 'Add README.md',
        content: Buffer.from('Hi').toString('base64'),
      },
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    console.log(`README file created: ${response.data.content.html_url}`);
  } catch (error) {
    if (error.response) {
      console.error(`Error creating README file: ${error.response.status} - ${error.response.data.message}`);
    } else {
      console.error(`Error creating README file: ${error.message}`);
    }
  }
}

createRepo();
