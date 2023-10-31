# The SDOH & Place Project

A repository for the landing page and the community toolkit of the SDOH & Place Project.

## Decap CMS Implementation

We have integrated a [Decap CMS](https://decapcms.org/) blog into this site, which is managed through Netlify. Features of this integration include:

- A draft > ready > publish workflow handled via commits and branches
- Content pages written in MDX: Markdown with optional React component integration
- A browser-based user interface accessible at `/admin`

To create/edit/delete blog posts:

- Log in with your GitHub credentials at [https://sdohplace.org/admin](https://sdohplace.org/admin) and create/edit/delete content there

Or

- Switch to the `publish` branch and make direct edits to the `.mdx` files in `content/news`

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
