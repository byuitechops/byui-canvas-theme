const git = require('simple-git');
const prompts = require('prompts');

/* Gets all branches on the repo and filters them to just the basic branch name */
async function getValidBranches() {
    var branches;
    await git().branch((err, summary) => {
        if (err) console.error(err);
        branches = Object.keys(summary.branches);
    });
    return branches.filter(branch => !branch.includes('/'));
}

/* Prompts the user for the current branch and validates that it is a branch on the current repo */
async function getUserInput(branches) {
    let response = await prompts({
        type: 'text',
        name: 'repo',
        message: 'What is your current repo?',
        validate: value => branches.includes(value) ? true : "That branch doesn't exist"
    })
    return response;
}

/* Pushes changes, merges the current branch with master */
async function doGitStuff(branch) {
    await git()
        .push('origin', branch)
        .checkout('master', (err) => console.error(err))
        .mergeFromTo(branch, 'master', (err) => console.error(err))
        .push('origin', 'master')
}

/* Calls all the functions in the correct order, passing what each function returns to the next function */
getValidBranches()
    .then((branches) => getUserInput(branches))
    .then((res) => doGitStuff(res.repo))


