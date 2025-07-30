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

## Dev install - Discovery App

We use the latest Netlify Edge feature [netlify edge](https://www.netlify.com/platform/core/edge) to host the middle-layer API for LLM calls while keeping the site statically hosted, maintaining our existing setup. Netlify Edge is an advanced feature that will also allow us to localize content, serve relevant ads, authenticate users, personalize content, redirect visitors, and much more in the future. This feature allows us to implement, test and deploy both server-based api calls and static content in the same environment.

1. (One-time setup) To install the app locally, run:

```
git clone https://github.com/healthyregions/SDOHPlace && cd SDOHPlace
yarn install
```

2. Set up environment variables:

```
cp .env.local.example .env
```

Update environment variables as needed. See the explanation in `.env.local.example` for what variables need to be setup.

2. To run the app locally, use:
```
npm run dev:full
```

This will start both the API and the display layer. Navigate to `localhost:3000` to view the front end. 

Note: Your browser may automatically open `localhost:8888`, but that’s for the API—you can close it. You can also monitor API results in the console.

3. To build and view the entire site locally, use
```
yarn build
yarn start
```

### Dev install - Decap CMS

To access the blog backend locally for testing, choose one of these two approaches, based on what you need to do. Note, in both cases you will need to edit the config file: Be sure not to commit these changes to version control!

#### To test admin interface without creating/viewing content on disk

If you just need to demo what it looks like to create content, for example you are developing a widget or constructing a new collection, then you can use the [test backend](https://decapcms.org/docs/test-backend/) that Decap provides.

This backend does not have access to your file system, so you can mockup content and update collections configurations without affecting any local files. All content will be lost when you refresh the page.

In `public/admin/config.yml` change `name: github` to `name: test-repo`, such that this

```
backend:
  name: github
  repo: healthyregions/SDOHPlace
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
  repo: healthyregions/SDOHPlace
  branch: publish
```

becomes

```
local_backend: true
backend:
  name: github
  repo: healthyregions/SDOHPlace
  branch: publish
```

Next, open a new terminal and use the following command to run the Decap server locally:

```
npx decap-server
```

Now, go to http://localhost:3000/admin/index.html. You will be presented with a simple Login button. Once logged in, you will find the CMS populated with all content from your local repo clone. If you edit content, you will immediately see changes in local files (the "editorial" workflow is not supported with the local backend).

## Running with Docker
We also provide a Docker Compose recipe for building and running a local instance of the app.

To build the image:
```
docker compose build
```
NOTE: this is a shorthand for running `docker build -t herop/sdoh-homepage .`

To run the application:
```bash
docker compose up -d
```
NOTE: this is a shorthand for running `docker run -it -p 8080:80 --env-file .env --name sdoh-homepage herop/sdoh-homepage`

Navigate to http://localhost:8080 to access the running application

To build and run in a single step:
```bash
docker compose up -d --build
```

To shut down the application:
```bash
docker compose down
```
NOTE: this is a shorthand for running `docker rm -f sdoh-homepage`
