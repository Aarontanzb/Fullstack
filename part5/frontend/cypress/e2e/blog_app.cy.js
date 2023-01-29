describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.visit('http://localhost:3000')
    cy.contains('login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('a new blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('#title').type('a title created by cypress')
      cy.get('#author').type('a author created by cypress')
      cy.get('#url').type('a note created by cypress')
      cy.get('#create-button').click()
      cy.contains('a title created by cypress')
    })

    it('a blog can be liked', function () {
      cy.contains('create new blog').click()
      cy.get('#title').type('a title created by cypress')
      cy.get('#author').type('a author created by cypress')
      cy.get('#url').type('a note created by cypress')
      cy.get('#create-button').click()
      cy.contains('view').click()
      cy.get('#like-button').click()
      cy.contains('likes 1')
    })

    it('a blog can be deleted', function () {
      cy.contains('create new blog').click()
      cy.get('#title').type('a title created by cypress')
      cy.get('#author').type('a author created by cypress')
      cy.get('#url').type('a note created by cypress')
      cy.get('#create-button').click()
      cy.contains('view').click()
      cy.get('#remove-button').click()
      cy.get('html').should('not.contain', 'a title created by cypress')
    })

    it.only('blogs are ordered by likes', function () {
      cy.contains('create new blog').click()
      cy.get('#title').type('The title with the most likes')
      cy.get('#author').type('a author created by cypress')
      cy.get('#url').type('a note created by cypress')
      cy.get('#create-button').click()
      cy.contains('view').click()
      cy.get('#like-button').click()
      cy.wait(500)
      cy.get('#like-button').click()
      // Create blog num 2
      cy.contains('create new blog').click()
      cy.get('#title').type('The title with the second most likes')
      cy.get('#author').type('a author created by cypress')
      cy.get('#url').type('a note created by cypress')
      cy.get('#create-button').click()
      cy.contains('The title with the second most likes')
        .contains('view')
        .click()
      cy.contains('The title with the second most likes')
        .contains('like')
        .click()
      // Check if ordered
      cy.reload()
      cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
      cy.get('.blog')
        .eq(1)
        .should('contain', 'The title with the second most likes')
    })
  })
})
