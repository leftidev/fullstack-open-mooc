const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Jebediah Kerman',
        username: 'jajuberg',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'jajuberg', 'salainen')
      await expect(page.getByText('Jebediah Kerman logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('jajuberg')
      await page.getByTestId('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()
  
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
      await expect(page.getByText('Jebediah Kerman logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'jajuberg', 'salainen')
      await expect(page.getByText('Jebediah Kerman logged-in')).toBeVisible()
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test blog', 'Test Author', 'http://test.url')
    
      const blog = page.locator('text=Test blog Test Author');
      await expect(blog).toBeVisible();
      await expect(blog).toHaveText(/Test blog Test Author/i);

      await page.getByRole('button', { name: 'view' }).click()
      const url = page.locator('text=http://test.url');
      await expect(url).toBeVisible();
      await expect(url).toHaveText(/http:\/\/test.url/i);
    })

    test('a blog can be liked', async ({ page }) => {   
      await createBlog(page, 'Test blog', 'Test Author', 'http://test.url')

      const blog = page.locator('text=Test blog Test Author');
      await expect(blog).toBeVisible();
      await expect(blog).toHaveText(/Test blog Test Author/i);

      await page.getByRole('button', { name: 'view' }).click()
      const url = page.locator('text=http://test.url');
      await expect(url).toBeVisible();
      await expect(url).toHaveText(/http:\/\/test.url/i);

      const initialLikes = await page.locator('[data-testid="likes"]').textContent();
      const initialLikeCount = parseInt(initialLikes, 10);
      expect(initialLikeCount).toBe(0);

      await page.getByRole('button', { name: 'like' }).click()

      await page.waitForTimeout(300)
      const updatedLikes = await page.locator('[data-testid="likes"]').textContent();
      const updatedLikeCount = parseInt(updatedLikes, 10);
      expect(updatedLikeCount).toBe(1);
    })

    test('a user can delete a blog they created', async ({ page }) => {
      await createBlog(page, 'Test blog', 'Test Author', 'http://test.url');
      
      const blog = page.locator('text=Test blog Test Author');
      await expect(blog).toBeVisible();
      await expect(blog).toHaveText(/Test blog Test Author/i);

      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'delete' }).click()

      await expect(blog).not.toBeVisible();
    })    
  })

  test('only the user who added the blog can see the delete button', async ({ page, request}) => {
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Aaron Kerman',
        username: 'aarokerm',
        password: 'salainen'
      }
    })

    await loginWith(page, 'jajuberg', 'salainen')
    await expect(page.getByText('Jebediah Kerman logged-in')).toBeVisible()

    // Create blog as jajuberg
    await createBlog(page, 'Test blog', 'Test Author', 'http://test.url');

    const blog = page.locator('text=Test blog Test Author');
    await expect(blog).toBeVisible();
    await expect(blog).toHaveText(/Test blog Test Author/i);
    
    // Make sure delete button is visible on the created blog
    await expect(page.getByRole('button', { name: 'delete' })).toBeVisible();
  
    // Logout jajuberg
    await page.getByRole('button', { name: 'logout' }).click()

    // Make sure login form is visible again
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()

    // Login as aarokerm
    await loginWith(page, 'aarokerm', 'salainen')
    await expect(page.getByText('Aaron Kerman logged-in')).toBeVisible()
  
    // Make sure aarokerm can see the blog but not the delete button
    await expect(blog).toBeVisible();
    await expect(blog).toHaveText(/Test blog Test Author/i);
    await expect(page.getByRole('button', { name: 'delete' })).toBeHidden();
  })
})