const apiURL = 'https://crudcrud.com/api/2466a9f6e50f49788773ab94e5031517/posts'
const postsForm = document.querySelector('form')


class Post {
    constructor(id, title, content){
        this.id = id
        this.title = title
        this.content = content
    }

    static getPosts() {
        fetch (apiURL,{
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }).then(response => response.json())
           .then(posts => {
                const postsContainer = document.createElement('ul')
                document.body.appendChild(postsContainer)
                posts.forEach(post => {   
                    const postItem = Post.createPostItem(post)
                    
                    postsContainer.appendChild(postItem)
                })
            })
    }

    static getPost(e) {
        e.preventDefault()
        const postId = e.target.getAttribute('data-post-id')
        fetch(`${apiURL}/${postId}`)
        .then(response => response.json())
        .then(post => {
            document.body.innerHTML = ''
            const goBackButton = document.createElement('button')
            goBackButton.textContent ='Go Back'
            goBackButton.addEventListener('click', Post.goBack)
            const postItemTitle = document.createElement('h2')
            postItemTitle.textContent = post.title
            const postItemContent = document.createElement('p')
            postItemContent.textContent = post.content
            document.body.appendChild(goBackButton)
            document.body.appendChild(postItemTitle)
            document.body.appendChild(postItemContent)
        }) 
    }

    static goBack() {
        document.body.innerHTML = ''
        document.body.innerHTML = postsForm.innerHTML
        Post.getPosts()
    }

    static deletePost(e) {
        const id = e.target.getAttribute('data-post-id')
        fetch(`${apiURL}/${id}`, {
            method:"DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })
       Post.removePostItemFromUI(id)
    }

    static removePostItemFromUI(id) {
        const postsContainer = document.querySelector('ul')
        const postItem = postsContainer.querySelector(`li[data-post-id="${id}"]`)
        postsContainer.removeChild(postItem)
    }

    static addPost (post) {
        const postsContainer = document.querySelector('ul')
        if (!postsContainer) {
            postsContainer = document.createElement('ul')
            document.body.appendChild(postsContainer)
        }
        const postItem = Post.createPostItem(post)
        postsContainer.insertBefore(postItem, postsContainer.firstChild)
    }

    static createPostItem(post) {
        const postItem = document.createElement('li')
        postItem.setAttribute('data-post-id', post._id)
        const postItemTitle = document.createElement('h2')
        const postItemLink = document.createElement('a')
        postItemLink.setAttribute('href', `posts/${post._id}`)
        postItemLink.setAttribute('data-post-id', post._id)
        postItemLink.addEventListener('click', Post.getPost)
        postItemLink.textContent=post.title
        postItemTitle.appendChild(postItemLink)
        const postItemContent = document.createElement('p')
        postItemContent.textContent=post.content
        postItem.appendChild(postItemTitle)
        postItem.appendChild(postItemContent)
        const deleteButton = document.createElement('button')
        deleteButton.textContent ='Delete'
        deleteButton.setAttribute('data-post-id', post._id)
        deleteButton.addEventListener('click', this.deletePost)
        postItem.appendChild(deleteButton)
        return postItem
    }
}

postsForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const formData = new FormData(postsForm)
    const plainFormData = Object.fromEntries(formData.entries())

    fetch (apiURL,{
    method: 'post',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify(plainFormData)
    })
    .then((response) => response.json())
    .then((post) => {
        // Add Post Item to the postsList
        Post.addPost(post)
        postsForm.querySelector('input#title').value = ''
        postsForm.querySelector('input#content').value = ''
    })
})

Post.getPosts()
