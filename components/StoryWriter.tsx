"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

const storiesPath = "public/stories";

function StoryWriter() {
  const [story, setStory] = useState<string>("");
  const [pages, setPages] = useState<number>();
  const [progress, setProgress] = useState("");
  const [runStarted, setRunStarted] = useState<boolean>(false);
  const [runFinished, setRunFinished] = useState<boolean | null>(null);
  const [currentTool, setCurrentTool] = useState("");

  async function runScript() {
    setRunStarted(true);
    setRunFinished(false);

    const response = await fetch("/api/run-script", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ story, pages, path: storiesPath }),
    });

    if (response.ok && response.body) {
      // Handle streams from the API
      //...
      console.log("Streaming started");
      // ...
    } else {
      setRunFinished(true);
      setRunStarted(false);
      console.error("Failed to start streaming");
    }
  }

  return (
    <div className="flex flex-col container">
      <section
        className="flex-1 flex flex-col border border-purple-300 rounded-md p-10
        space-y-2"
      >
        {/* TEXTAREA for user's story */}
        <Textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          className="flex-1 text-black"
          placeholder="Write a story about a robot and a human who become friends..."
        />

        {/* SELECT input for number of pages */}
        <Select onValueChange={(value) => setPages(parseInt(value))}>
          <SelectTrigger>
            <SelectValue placeholder="How many pages should the story be?" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }, (_, i) => (
              <SelectItem key={i} value={String(i + 1)}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* GENERATE STORY button */}
        <Button
          disabled={!story || !pages || runStarted}
          className="w-full"
          size="lg"
          onClick={runScript}
        >
          Generate Story
        </Button>
      </section>

      <section className="flex-1 pb-5 mt-5">
        <div
          className="flex flex-col-reverse w-full space-y-2 bg-gray-800 rounded-md
          text-gray-200 font-mono p-10 h-96 overflow-y-scroll"
        >
          <div>
            {runFinished === null && (
              <>
                <p className="animate-pulse mr-5">
                  I'm waiting for you to generate a story above...
                </p>
                <br />
              </>
            )}
            <span className="mr-5">{">>"}</span>
          </div>

          {/* Current Tool */}
          {currentTool && (
            <div className="py-10">
              <span className="mr-5">{"--- [Current Tool] ---"}</span>
              {currentTool}
            </div>
          )}

          {/* Render Events... */}

          {runStarted && (
            <div>
              <span className="mr-5 animate-in">
                {"--- [AI storyteller has started] ---"}
              </span>
              <br />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default StoryWriter;
