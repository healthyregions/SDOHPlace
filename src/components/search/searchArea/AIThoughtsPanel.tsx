import * as React from "react";
import { CircularProgress } from "@mui/material";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

const fullConfig = resolveConfig(tailwindConfig);

interface AIThoughtsPanelProps {
  isLoading: boolean;
  thoughts: string;
  aiSearch: boolean;
}

const AIThoughtsPanel: React.FC<AIThoughtsPanelProps> = ({
  isLoading,
  thoughts,
  aiSearch,
}) => {
  if (!aiSearch) {
    return null;
  }

  return (
    <div className="w-full bg-gray-50 rounded-lg border border-frenchviolet/20 mt-2">
      <div className="p-4">
        <h3 className="text-md text-frenchviolet mb-2">
          Inspired by your search:
        </h3>
        <p className="text-sm text-gray-600 break-words">
          {isLoading ? (
            <div className="flex items-center justify-center w-full py-2">
              <CircularProgress
                size={20}
                className="text-frenchviolet"
                sx={{ animationDuration: "550ms" }}
              />
            </div>
          ) : thoughts ? (
            <span dangerouslySetInnerHTML={{ __html: thoughts }} />
          ) : (
            <div>
              <p>Type a research question to get AI-inspired suggestions.</p>
              <p className="text-sm text-gray-600">
                e.g.{" "}
                <i>
                  &quot;What impact does housing stability have on the health
                  outcomes of low-income populations?&quot;
                </i>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                You can also ask questions in your native language to find the
                information you need more easily.
                <br />
                e.g.{" "}
                <i>
                  &quot;¿Cómo influye el nivel educativo en el acceso a
                  servicios de salud en comunidades rurales?&quot;
                </i>
              </p>
            </div>
          )}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          <b>Note:</b> We are currently working on integrating filters with AI search results. At this time, filters do not apply to AI-generated results. Clicking a filter will trigger a re-ask of your question instead.
        </p>
      </div>
    </div>
  );
};

export default AIThoughtsPanel;
