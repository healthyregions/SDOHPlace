# The SDOH & Place Project

A repository for the landing page and the community toolkit of the SDOH & Place Project.

## Blog: Decap CMS Implementation

We have integrated a [Decap CMS](https://decapcms.org/) blog into this site, which is managed through Netlify. Features of this integration include:

- A draft > ready > publish workflow handled via commits and branches
- Content pages written in MDX: Markdown with optional React component integration
- A browser-based user interface accessible at `/admin`

To create/edit/delete blog posts:

- Log in with your GitHub credentials at [https://sdohplace.org/admin](https://sdohplace.org/admin) and create/edit/delete content there

Or

- Switch to the `publish` branch and make direct edits to the `.mdx` files in `content/news`

### Tips for Writing Blog Posts

- Each post should have at least one tag.
- Don't use `<` or `>` in the text of a post. If you need those characters, use `&lt;` (lt = "less than") and `&gt;` (gt = "greater than").
  - The reason for this is that markdown can support inclusion of HTML elements, which look like `<element-name>`. If `<>` are found outside of a valid HTML element, they will cause an error.
- Do not include raw links directly in the post text, always make normal text, highlight, and then add a link to it.
  - For example, make a link that looks like [sdohplace.org](https://sdohplace.org) instead of putting `https://sdohplace.org` directly in the post body
- To add a caption under an image, put the following snippet directly into the post body underneath the image, and add your caption text within it:
    ```
    <table class="img-caption"><caption>(insert caption text here)</caption></table>
    ```
- If you need to change the slug of the post after it has been created, you will also need to manually change the file name to match the new slug.


## Branch Configuration

The production site is built from the `publish` branch and visible at [https://sdohplace.org](https://sdohplace.org).

A staging site is built from the `main` branch and is visible at [https://main--cheerful-treacle-913a24.netlify.app/](https://main--cheerful-treacle-913a24.netlify.app/).

_The staging site should only be used to preview code changes, not to create/edit/delete blog posts._

To contribute code to this repo:

1. Create a feature branch from `main`
2. Commit code to it and create a PR against `main`
3. After the PR is merged, changes will be reflected on the [staging site](https://main--cheerful-treacle-913a24.netlify.app/)
4. To deploy, create another PR from `main` against the `publish` branch

**_The `publish` branch should never be merged back into the `main` branch!_**

We've chosen this setup to keep code development history on the main branch, and isolate all of the blog-authored commit activity to the publish branch.

## Local Installation

```
git clone https://github.com/healthyregions/SDOHPlace && cd SDOHPlace
yarn install
yarn dev
```

View in browser at http://localhost:3000.

To build and view the entire site locally, use

```
yarn build
yarn start
```

### Local Decap Blog

To access the blog backend locally for testing, it is best to use the [test backend](https://decapcms.org/docs/test-backend/) that Decap provides.

In `public/admin/config.yml` change `name: git-gateway` to `name:test-repo`.

Now, go to http://localhost:3000/admin/index.html.

This backend does not have access to your file system, so you can create content and update collections configurations without affecting any local files. All content will be lost when you refresh the page.
