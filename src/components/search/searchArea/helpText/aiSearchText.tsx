import { Typography } from "@mui/material";
import Link from "next/link";
import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

export const AiSearchText = () => {
  const fullConfig = resolveConfig(tailwindConfig);
  return (
    <>
      <Typography
        className="pb-1"
        sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}
      >
        Try our AI-powered search that helps you find data by simply asking a
        question.
      </Typography>

      <div className="my-3 p-3 bg-gray-50 rounded-lg">
        <Typography
          className="font-medium mb-2"
          sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}
        >
          See the difference:
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded border border-gray-200">
            <Typography
              className="font-medium mb-1"
              sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}
            >
              Keyword Search:
            </Typography>
            <div className="italic text-sm mb-2">
              You type: &quot;housing insecurity&quot;
            </div>
            <div className="text-sm">
              Looks for exact words with prefix of &quot;housing
              insecurity&quot; in our database when you begin to type, then
              shows results as suggested terms.
            </div>
          </div>

          <div className="p-3 bg-white rounded border border-gray-200">
            <Typography
              className="font-medium mb-1"
              sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}
            >
              AI Search:
            </Typography>
            <div className="italic text-sm mb-2">
              You ask: &quot;What health outcomes are linked to housing
              instability in Chicago?&quot;
            </div>
            <div className="text-sm">
              Understands your question and finds information about
              &quot;housing&quot;, &quot;health outcomes&quot;, and location
              references within the Social Determinants of Health context to
              help you answer your question with answers filtered by location.
            </div>
          </div>
        </div>
      </div>

      <Typography
        className="pb-1"
        sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}
      >
        Behind the scenes, our AI assistant reads your question, figures out
        what information would best answer it, and then searches our database
        accordingly. We show you this &quot;thinking process&quot; below the
        search box so you can see how it interpreted your question.
      </Typography>

      <Typography
        className="pb-1"
        sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}
      >
        Don&apos;t want to use AI? Our keyword search mode is always available
        and does not send any queries to AI systems.
      </Typography>

      <Typography
        className="pb-1"
        sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}
      >
        We would love to hear your thoughts on this feature. Please{" "}
        <Link href="/contact">get in touch</Link>.
      </Typography>

      <div className="my-3 mx-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
        <Typography
          className="mb-2"
          sx={{
            fontFamily: fullConfig.theme.fontFamily["sans"],
            fontSize: "0.8em",
            fontWeight: "bold",
          }}
        >
          Note About Location Search:
        </Typography>
        <Typography
          className="pb-1"
          sx={{
            fontFamily: fullConfig.theme.fontFamily["sans"],
            fontSize: "0.8em",
          }}
        >
          When you include location terms in your questions (like Chicago), our
          AI will find location-relevant results, but this isn&apos;t yet
          connected to the map display and the filter panel. The AI translates
          locations into geographic boundaries for searching, though these
          filters aren&apos;t visible in the map interface.{" "}
          <b>
            We&apos;re working to fully integrate these features in our next
            update.
          </b>
        </Typography>
      </div>
    </>
  );
};
