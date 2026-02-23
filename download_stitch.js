const fs = require('fs');
const https = require('https');
const path = require('path');

const files = [
  {
    name: "services_dark_mode.png",
    url: "https://lh3.googleusercontent.com/aida/AOfcidWKBf7gG_tBJ_nctt-4A42QCyeBfZMyB0rGLfKccCQk2LHe70w7pZ0ngEG-k_EwSgpVBTuL9XyFGZYSECqA-wUBNitj8dvrmUISfIvryy9cwtQ-scBQvbLNI4qy_eRIYipEuERmrwpwDb3Y4zVhzKUNLsiwi1Cy0beZ3jLuT9WyPO7wWPQZ-btkPZ72n2Q_EAKUhRw3VyrQvV0C7W0oMwuQtuNv9eR5eQqZVUpaSz6mpeND42SM6SXNkYk"
  },
  {
    name: "services_dark_mode.html",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzE3N2M0NmE1ZDM5NDRkMzliYjgwODE4NTQ2ODkxZDc5EgsSBxDDhM7O2hcYAZIBJAoKcHJvamVjdF9pZBIWQhQxODExOTA2NTMyODYzODE2NzMwMA&filename=&opi=89354086"
  },
  {
    name: "homepage_light_mode.png",
    url: "https://lh3.googleusercontent.com/aida/AOfcidUhtWdXOs8xs16nk0HyFECWiJRmlzMO-IYDbt92zB4l4t3HisMD9bllXYnClakMrGv-MuOcf5hVoLTHXeR8UHCGfsbtIifAnFaLiHw8az5DOCLw-EGmVfl9rxWmFht1s_cKDHwI6xAitncgZ3AGk3aGKBl-tzZSLDBQM1Kdl9Nx0HEpu5brU2Unqq6AcJrGPh5WcZq7x7YpHqgD6q8ivhMNWEDlfYTs_avB9KAlywnuB6NdlvXX6P5UnlbA"
  },
  {
    name: "homepage_light_mode.html",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzdhYjlkNjVlMGU2YTRhOWY5N2I5MmZlM2EzNTBkODA4EgsSBxDDhM7O2hcYAZIBJAoKcHJvamVjdF9pZBIWQhQxODExOTA2NTMyODYzODE2NzMwMA&filename=&opi=89354086"
  },
  {
    name: "services_light_mode.png",
    url: "https://lh3.googleusercontent.com/aida/AOfcidW85YJI-SmaZPFAuV-jt2J4kFTCV_JDGJqqSi2rPBneJr0iDqKHedKkvKLjQGS_-M81MOytPzDEI0LdEPUbJZqcsli_LM2Z_jsRP_vmMDCWM_vOX65ncW0myjBZtwoE7nVnFeIbjNSaE5cCRczrw7yqu9vic1BSk4fo13EmwvTB_5jTqVM0xaaLxyr5watt2SuA7Nyi_tbJ8DeQKedZjnQFRscZohqGB3mBAK9FTcM7A0tdG2cKlMjySahT"
  },
  {
    name: "services_light_mode.html",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2M4NzVkOWQ1ZThhMzRkMDM4YWUyNTk5MjdjMTFkNzIxEgsSBxDDhM7O2hcYAZIBJAoKcHJvamVjdF9pZBIWQhQxODExOTA2NTMyODYzODE2NzMwMA&filename=&opi=89354086"
  },
  {
    name: "homepage_dark_mode.png",
    url: "https://lh3.googleusercontent.com/aida/AOfcidXNqkTgLi1R6VON666at4SCG9QEMQ9Sd6cXgm4gpf8YmXEJQkoQRQfH9WtqaB3N8Ct0D1Ve2HkoFxxUvtexbgPHAMNY2RdMg4LyeQy9PS_Q9Jwnu5OyZkAj5DQ0UsA39ln_Gq2EggRfi7v9ydz-I-GHkzt77oDRmg4KwRKD6UUMHP2A9SK6AirjrfdAPO4_haq8MzOUOJnxo8mWSFodY7gCq7Ytpc8QB8tek6J6gXb6kZxoLRYY4FO-nAfy"
  },
  {
    name: "homepage_dark_mode.html",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2JjNmJhNjBlOTYwMzQyMGE4MmIxNTg0Y2IyNDhlMjMzEgsSBxDDhM7O2hcYAZIBJAoKcHJvamVjdF9pZBIWQhQxODExOTA2NTMyODYzODE2NzMwMA&filename=&opi=89354086"
  }
];

const downloadDir = path.join(__dirname, 'stitch_exports');

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303 || res.statusCode === 307 || res.statusCode === 308) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Failed to get ' + url + ' (' + res.statusCode + ')'));
      }
      
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(dest);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

async function main() {
  for (const f of files) {
    console.log(`Downloading ${f.name}...`);
    try {
      await downloadFile(f.url, path.join(downloadDir, f.name));
      console.log(`Successfully downloaded ${f.name}`);
    } catch (err) {
      console.error(`Error downloading ${f.name}:`, err.message);
    }
  }
}

main().catch(console.error);
