document.addEventListener('DOMContentLoaded', () => {
    dealWithForm()
})

function dealWithForm(){
    const form = document.querySelector('#github-form')

    form.addEventListener('submit', e => {
        e.preventDefault()
        document.getElementById('repos-list').innerHTML = ''
        document.getElementById('user-list').innerHTML = ''
        const search = e.target.querySelector('#search').value
        dealWithSearch(search)
        form.reset()
    })
}

function dealWithSearch(input){
    const userList = document.getElementById('user-list')

    fetch(`https://api.github.com/search/users?q=${input}`,{
        header: {
            Accept: 'application/vnd.github.v3+json'
        }
    })
    .then(resp => resp.json())
    .then(data => {
        const li = document.createElement('li')
        const userName = data.items[0].login
        const avatar = data.items[0].avatar_url
        const link = data.items[0].html_url
        

        li.innerHTML = `
            <h1>${userName}</h1>
            <img src = ${avatar}>
            <p><a href = ${link}>GitHub Link</a></p>
        `
        userList.appendChild(li)

        let count = 0
        li.querySelector('h1').addEventListener('click', () => {
            if(count < 1){
                dealWithRepos(data, input)
                count++
            }
        })
    })
}

function dealWithRepos(user, input){
    console.log(user)
    fetch(`https://api.github.com/users/${input}/repos`, {
        header: {
            Accept: 'application/vnd.github.v3+json'
        }
    })
    .then(resp => resp.json())
    .then(data => {
        const div = document.createElement('div')
        for(const repository of data){
            addRepository(repository, div)
        }
        console.log(div)
    })
}

function addRepository(repository,  div){
    const repoList = document.getElementById('repos-list')
    li = document.createElement('li')
    const link = repository.html_url
    li.innerHTML = `
        <p><a href = ${link}>${repository.name}</a></p>
    `
    div.appendChild(li)
    repoList.appendChild(div)
}