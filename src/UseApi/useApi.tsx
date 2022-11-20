import { Octokit } from "@octokit/core";

const myoctokit = new Octokit({
    auth: 'YOUR_TOKEN',
});

export default myoctokit;