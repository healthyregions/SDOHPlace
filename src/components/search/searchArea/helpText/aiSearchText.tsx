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
        We&apos;ve added an AI-powered search option that helps you find answers, not
        just keywords!
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
              You ask: &quot;What could cause housing instability and poor
              health outcomes?&quot;
            </div>
            <div className="text-sm">
              Understands your question and finds information about
              &quot;housing&quot;, &quot;economic stability&quot;, and
              &quot;health outcomes&quot; within the Social Determinants of
              Health context to help you answer your question.
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
        Don&apos;t want to use AI? No problem! Our standard search mode is
        always available and doesn&apos;t send any queries to AI systems.
      </Typography>

      <Typography
        className="pb-1"
        sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}
      >
        We&apos;d love to hear your thoughts on this feature! Please{" "}
        <Link href="/contact">get in touch</Link>.
      </Typography>
    </>
  );

  //   <>
  //     <Typography
  //       className="pb-1"
  //       sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}
  //     >
  //       We&apos;ve added an AI-powered search option that helps you find answers, not just keywords!
  //     </Typography>

  //     <div className="my-3 p-3 bg-gray-50 rounded-lg">
  //       <Typography
  //         className="font-medium mb-2"
  //         sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}
  //       >
  //         See the difference:
  //       </Typography>

  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //         <div className="p-3 bg-white rounded border border-gray-200">
  //           <Typography
  //             className="font-medium mb-1"
  //             sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}
  //           >
  //             Standard Search:
  //           </Typography>
  //           <div className="italic text-sm mb-2">You type: "children food access limited"</div>
  //           <div className="text-sm">
  //             Looks for exact words "children," "food," "access," and "limited"
  //             in our database
  //           </div>
  //         </div>

  //         <div className="p-3 bg-white rounded border border-gray-200">
  //           <Typography
  //             className="font-medium mb-1"
  //             sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}
  //           >
  //             AI Search:
  //           </Typography>
  //           <div className="italic text-sm mb-2">You ask: "Where is children's food access the most limited?"</div>
  //           <div className="text-sm">
  //             Understands your question and finds areas with high childhood food insecurity,
  //             food deserts affecting youth, and related health outcomes
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     <Typography
  //       className="pb-1"
  //       sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}
  //     >
  //       Our AI search helper takes your question and translates it into the best possible search terms.
  //       We show you exactly how it interpreted your question right below the search box.
  //     </Typography>

  //     <Typography
  //       className="pb-1"
  //       sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}
  //     >
  //       Privacy note: AI search is optional. Standard keyword search doesn't send any information
  //       to AI systems.
  //     </Typography>

  //     <Typography
  //       className="pb-1"
  //       sx={{ fontFamily: fullConfig.theme.fontFamily["sans"] }}
  //     >
  //       We'd love to hear your thoughts on this feature! Please{" "}
  //       <Link href="/contact">get in touch</Link>.
  //     </Typography>
  //   </>
  // );
};
