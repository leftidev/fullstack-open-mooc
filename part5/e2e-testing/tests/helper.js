const loginWith = async (page, username, password)  => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
  }

  const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new note' }).click()
    await page.locator('[placeholder="blogTitle"]').fill(title);
    await page.locator('[placeholder="blogAuthor"]').fill(author);
    await page.locator('[placeholder="blogUrl"]').fill(url);
    await page.getByRole('button', { name: 'create' }).click()
  }

  export { loginWith, createBlog }