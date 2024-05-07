"use client";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import React from "react";
import Footer from "@/components/Footer";

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <main className="flex-grow flex flex-col items-center justify-center">
      <section
        className="flex flex-col-reverse md:flex-row h-screen w-full pt-10 md:pt-20 px-8 md:px-16 items-center justify-center gap-9 md:gap-2"
        style={{
          background: "url('/bg3.webp')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            <span className="font-semibold"> Get-Responses </span>- Where your
            identity remains a{" "}
            <span className="bg-primary text-white p-1">secret.</span>
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            <li>✅ Easy to use </li>
            <li>✅ Fully anonymous </li>
            <li>✅ Random Tareef </li>
          </ul>
        </div>
        <div className="w-full md:w-1/2">
          <img className="rounded-lg" src="/image.png" alt="" />
        </div>
      </section>
      <section
        className="flex flex-col h-[90vh] w-full pt-20 px-8 md:px-16 items-center gap-9 md:gap-40"
        style={{
          background: "url('/bg.png')",
        }}
      >
        <h1 className="text-3xl text-center md:text-left md:text-5xl font-bold">
          <span className="bg-primary text-white p-1">Let people say,</span>{" "}
          what they always wanted to say.
        </h1>
        <Carousel plugins={[plugin.current]} className="w-[60vw]">
          <CarouselContent>
            {messages.map((message) => (
              <CarouselItem key={message.title}>
                <div className="p-1">
                  <Card>
                    <CardHeader>{message.title}</CardHeader>
                    <CardContent className="flex items-center p-6">
                      <span className="text-xl md:text-4xl font-semibold">
                        {message.content}
                      </span>
                    </CardContent>
                    <CardFooter>{message.received}</CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-accent-foreground" />
          <CarouselNext className="text-accent-foreground" />
        </Carousel>
      </section>
      <Footer />
    </main>
  );
}
