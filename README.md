# The SDOH & Place Project

A repository for the landing page and the community toolkit of the SDOH & Place Project.

## Decap CMS

We use [Decap CMS](https://decapcms.org/) to implement a static content management system withint the site. Features of this integration include:

- A draft > ready > publish workflow handled via commits and branches
- Content pages written in MDX: Markdown with optional React component integration
- A browser-based user interface accessible at `/admin`
- Multiple categories of content: posts, guides, team/fellow profiles, etc.

To create/edit/delete content:

- Log in with your GitHub credentials at [https://sdohplace.org/admin](https://sdohplace.org/admin) and create/edit/delete content there

Or

- Switch to the `publish` branch and make direct edits to the `.mdx` files in `content/news`

A full guide to using the CMS is available internally on our Notion workspace.

### Permission configuration

Write access to the content management system is based on Github authentication and team membership.

- Any outside collaborators with `Write` access to this repository can login and create **draft** content in the CMS at [sdohplace.org/admin](https://sdohplace.org/admin) using their Github credentials.
- Draft content can only be published by users who have either 1) A `Maintain` or `Admin` role on this repository, or 2) are members of the `sdohplace-cms-admins` team.

Initial login is implemented through a Github OAuth application owned by the Healthy Regions org which is linked to deployment of this site on Netlify.

The draft/publish restrictions are implemented through branch protection rulesets on the `main` and `publish` branches of this repository.

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

## Dev install

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

### Environment Variables

```
cp .env.local.example .env
```

Update environment variables as needed.

- `NEXT_PUBLIC_SOLR_URL` - If you are running Solr locally, the default value should be sufficient. Otherwise, set to `http://<your solr installation>/solr/blacklight-core`.
- `NEXT_PUBLIC_MAPTILER_API_KEY` - Set the API key for MapTiler services. This is used for the basemap style, as well as the geocoding service.

### Dev install - Decap CMS

To access the blog backend locally for testing, choose one of these two approaches, based on what you need to do. Note, in both cases you will need to edit the config file: Be sure not to commit these changes to version control!

#### To test admin interface without creating/viewing content on disk

If you just need to demo what it looks like to create content, for example you are developing a widget or constructing a new collection, then you can use the [test backend](https://decapcms.org/docs/test-backend/) that Decap provides.

This backend does not have access to your file system, so you can mockup content and update collections configurations without affecting any local files. All content will be lost when you refresh the page.

In `public/admin/config.yml` change `name: github` to `name: test-repo`, such that this

```
backend:
  name: github
  repo: repo: healthyregions/SDOHPlace
  branch: publish
```

becomes

```
backend:
  name: test-repo
  repo: healthyregions/SDOHPlace
  branch: publish
```

Now, go to http://localhost:3000/admin/index.html. You will be presented with a simple Login button. Once logged in, you will see "Test Backend" in the top right corner of the page.

#### To view/edit existing posts that are in your current branch

In this case, Decap needs to be reading from your local filesystem. First add `local_backend: true` to the top of `public/admin/config.yml`, such that this

```
backend:
  name: github
  repo: repo: healthyregions/SDOHPlace
  branch: publish
```

becomes

```
local_backend: true
backend:
  name: github
  repo: repo: healthyregions/SDOHPlace
  branch: publish
```

Next, open a new terminal and use the following command to run the Decap server locally:

```
npx decap-server
```

Now, go to http://localhost:3000/admin/index.html. You will be presented with a simple Login button. Once logged in, you will find the CMS populated with all content from your local repo clone. If you edit content, you will immediately see changes in local files (the "editorial" workflow is not supported with the local backend).
