"use client"

import { useState } from "react"
import { XIcon } from "./icons/x-icon"
import { InstagramIcon } from "./icons/instagram-icon"
import { DiscordIcon } from "./icons/discord-icon"
import { FacebookIcon } from "./icons/facebook-icon"
import { LinkedInIcon } from "./icons/linkedin-icon"
import { Avatar } from "./avatar"
import { SocialIcon } from "./social-icon"
import WaitlistForm from "./waitlist-form"
import { motion, AnimatePresence } from "framer-motion"
import { GitHubStars } from "./githupStars"
import Image from "next/image";

type FormState = "initial" | "confirmation" | "questions";

export function WaitlistSignup() {
  const [formState, setFormState] = useState<FormState>("initial");

  const handleStateChange = (newState: FormState) => {
    setFormState(newState);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-8 flex flex-col justify-between min-h-screen">
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <AnimatePresence mode="wait">
          {formState === "initial" && (
            <motion.div
              key="header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-gray-200 to-gray-600">
                Discover Your Perfect Career
              </h2>
              <p className="text-lg sm:text-xl mb-8 text-gray-300">
                No more guessing! Let your grades and interests guide you to the
                right college major or career — just 10 questions away.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full">
          <WaitlistForm onStateChange={handleStateChange} />
        </div>

        <AnimatePresence>
          {formState === "initial" && (
            <motion.div
              key="social-proof"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              {/* <div className="flex items-center justify-center">
                <div className="flex -space-x-2 mr-4">
                  <Avatar initials="JD" index={0} />
                  <Avatar initials="AS" index={1} />
                  <Avatar initials="MK" index={2} />
                </div>
                <p className="text-white font-semibold">100+ people on the helped </p>
              </div> */}

              <GitHubStars />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {formState === "initial" && (
          <motion.div
            key="footer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-8 flex justify-center space-x-6"
          >
            <div className="flex text-white items-center bg-white/5 px-6 py-3 rounded-xl backdrop-blur-sm [&>*]:mx-0">
              <span className="text-base font-medium tracking-wide text-gray-300 -mr-1">
                Backed by
              </span>
              <Image
                src="/mti-logo.svg"
                alt="MTI Institute"
                width={60}
                height={60}
                className="object-contain pt-3"
              />
              <span className="text-base font-medium tracking-wide text-gray-300 -ml-1">
                Institute
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      {/* <AnimatePresence>
        {formState !== 'initial' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 flex left-[50%]  transform -translate-x-1/2"
          >
            <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <div 
                className={`w-2 h-2 rounded-full ${
                  formState === 'confirmation' ? 'bg-blue-500' : 'bg-white/30'
                }`}
              />
              <div 
                className={`w-2 h-2 rounded-full ${
                  formState === 'questions' ? 'bg-blue-500' : 'bg-white/30'
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </div>
  );
}

