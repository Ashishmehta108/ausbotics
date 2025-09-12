"use client"

import { Card } from "@/components/ui/card"

export function DemoVideo() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="relative w-full aspect-video bg-black">
        {/* Replace the src below with your actual video URL (YouTube/Vimeo/etc.) */}
        <iframe
          className="absolute inset-0 h-full w-full"
          src="https://www.youtube.com/embed/ysz5S6PUM-U"
          title="Product Demo Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </Card>
  )
}
