document.addEventListener('DOMContentLoaded', () => {
    dealWithForm()
})

function dealWithForm(){
    //Grab form element
    const form = document.querySelector('#github-form')

    //When form is submited
    form.addEventListener('submit', e => {
        e.preventDefault()

        //Resets the repos and user list so website only displays 1 specified user at a time
        document.getElementById('repos-list').innerHTML = ''
        document.getElementById('user-list').innerHTML = ''
        //Gets the value the user inputted and deals with that search
        const search = e.target.querySelector('#search').value
        dealWithSearch(search)
        //Resets the form
        form.reset()
    })
}

function dealWithSearch(input){
    //Gets the user list area of the DOM
    const userList = document.getElementById('user-list')

    //Fetches the GitHub of the user searched
    fetch(`https://api.github.com/search/users?q=${input}`,{
        header: {
            Accept: 'application/vnd.github.v3+json'
        }
    })
    .then(resp => resp.json())
    .then(data => {
        //Creates a list element
        const li = document.createElement('li')
        //Grabs the username, avatar url, and link of the persons GitHub
        const userName = data.items[0].login
        const avatar = data.items[0].avatar_url
        const link = data.items[0].html_url
        

        //Sets the list item inner HTML to include the username, avatar, and a link to their GitHub
        li.innerHTML = `
            <h1>${userName}</h1>
            <img src = ${avatar}>
            <p><a href = ${link}>GitHub Link</a></p>
        `
        //Adds the list element to the user list
        userList.appendChild(li)

        //Makes a count variable so when a user continuously clicks, their repositories don't keep on listing over and over
        let count = 0
        //When username is clicked, it goes and fetches the repos and displays them to the DOM
        li.querySelector('h1').addEventListener('click', () => {
            if(count < 1){
                dealWithRepos(data, input)
                //Sets count to > 0 so repos list doesn't get very long
                count++
            }
        })
    })
}

function dealWithRepos(user, input){
    //Grabs the specified user's repositories
    fetch(`https://api.github.com/users/${input}/repos`, {
        header: {
            Accept: 'application/vnd.github.v3+json'
        }
    })
    .then(resp => resp.json())
    .then(data => {
        //Goes through all repositories and adds them to the DOM
        for(const repository of data){
            addRepository(repository)
        }
    })
}

function addRepository(repository){
    //Grabs the repository list area
    const repoList = document.getElementById('repos-list')
    //Creates a new list element
    li = document.createElement('li')
    //Grabs the link to the repository
    const link = repository.html_url
    //Sets the list to be able to contain a paragrpah with a link displaying to each repository
    li.innerHTML = `
        <p><a href = ${link}>${repository.name}</a></p>
    `
    //Adds the list item to the repository list
    repoList.appendChild(li)
}