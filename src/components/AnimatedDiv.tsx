"use client"

import { motion } from "framer-motion"
import React from "react"

type Props = React.ComponentProps<typeof motion.div>

export default function AnimatedDiv(props: Props) {
  return <motion.div {...props} />
}
