"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowDownRight, ArrowRight, Leaf, Sprout } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-gradient-to-br from-[#f5f7ed] via-[#fbfcf7] to-[#e6efdf]">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-lime-300/15 blur-3xl" />
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] items-center gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-4 lg:px-12 lg:py-10 xl:px-16">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out motion-reduce:animate-none relative z-10 max-w-xl">
          <Badge className="h-auto gap-2 rounded-full border border-emerald-900/10 bg-white/75 px-3 py-1.5 text-emerald-950 shadow-sm backdrop-blur">
            <span className="grid size-6 place-items-center rounded-full bg-emerald-800 text-white">
              <Sprout className="size-3.5" aria-hidden="true" />
            </span>
            A community for a greener future
          </Badge>

          <h1 className="mt-7 max-w-[12ch] text-5xl font-semibold leading-[1.03] tracking-tight text-[#173c2a] sm:text-6xl lg:text-7xl">
            Small actions.
            <span className="mt-2 block text-[#557b39]">Lasting impact.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-[#536457] sm:text-lg sm:leading-8">
            Find practical ideas, share what you learn, and join people creating
            healthier places for nature and for one another.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              nativeButton={false}
              className="h-12 rounded-lg bg-[#1f5b3c] px-6 text-white shadow-md shadow-emerald-950/10 hover:bg-[#174a30]"
              render={<Link href="/auth/register" />}
            >
              Get started
              <ArrowRight className="ml-1 size-4" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              className="h-12 rounded-lg border-[#c9d7c5] bg-white/70 px-6 text-[#244633] hover:bg-white"
              render={<Link href="/about" />}
            >
              Learn more
              <ArrowDownRight className="ml-1 size-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="mt-10 flex max-w-md items-center gap-5 rounded-lg border border-emerald-950/10 bg-white/55 px-4 py-3 backdrop-blur-sm">
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e8f0df] text-[#42734b]">
              <Leaf className="size-5" aria-hidden="true" />
            </div>
            <p className="text-sm leading-6 text-[#536457]">
              <span className="font-semibold text-[#244633]">Ideas into action</span>
              <br />
              Learn, contribute, and grow together.
            </p>
            <Separator orientation="vertical" className="ml-auto hidden h-9 bg-emerald-950/15 sm:block" />
            <span className="hidden text-xs font-medium text-[#617465] sm:block">EcoSpark Hub</span>
          </div>
        </div>

        <div
          aria-label="EcoSpark community and forest imagery"
          className="animate-in fade-in slide-in-from-bottom-4 delay-150 duration-700 ease-out motion-reduce:animate-none relative mx-auto h-[510px] w-full max-w-[700px] sm:h-[620px] lg:h-[min(760px,88vh)]"
        >
          <Card className="absolute inset-x-[10%] bottom-[10%] top-[8%] rounded-lg border-4 border-white/80 bg-[#244633] shadow-2xl shadow-emerald-950/20 transition-transform duration-500 hover:scale-[1.015]">
            <Image
              src="/sustainability-essentials.webp"
              alt="Sunlight falling through a green forest along a woodland path"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 52vw"
              className="rounded-md object-cover"
            />
            <div className="absolute inset-0 rounded-md bg-gradient-to-t from-[#102b1e]/75 via-transparent to-[#173c2a]/10" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 text-white sm:bottom-7 sm:left-7 sm:right-7">
              <div>
                <p className="text-xs font-semibold uppercase text-white/75">Our shared home</p>
                <p className="mt-1 text-xl font-semibold sm:text-2xl">A brighter future grows together.</p>
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/40 bg-white/15 backdrop-blur-sm">
                <Leaf className="size-5" aria-hidden="true" />
              </span>
            </div>
          </Card>

          <Card className="absolute left-0 top-0 w-[38%] rotate-[-3deg] rounded-lg border-4 border-white bg-white shadow-xl transition-transform duration-500 hover:z-20 hover:rotate-0 hover:scale-105 sm:w-[34%]">
            <div className="relative aspect-square overflow-hidden rounded-md">
              <Image
                src="/7-ecosystem-services-Forest’s-hidden-superpowers.png"
                alt="Seven ecosystem services provided by forests"
                fill
                sizes="(max-width: 640px) 38vw, 240px"
                className="object-cover"
              />
            </div>
          </Card>

          <Card className="absolute right-0 top-[12%] w-[30%] rotate-[3deg] rounded-lg border-4 border-white bg-white shadow-xl transition-transform duration-500 hover:z-20 hover:rotate-0 hover:scale-105 sm:w-[27%]">
            <div className="relative aspect-[0.72] overflow-hidden rounded-md">
              <Image
                src="/images (3).jpeg"
                alt="A solar-powered neighborhood surrounded by green space"
                fill
                sizes="(max-width: 640px) 30vw, 190px"
                className="object-cover"
              />
            </div>
          </Card>

          <Card className="absolute bottom-[1%] left-[2%] w-[38%] rotate-[2deg] rounded-lg border-4 border-white bg-white shadow-xl transition-transform duration-500 hover:z-20 hover:rotate-0 hover:scale-105 sm:w-[34%]">
            <div className="relative aspect-square overflow-hidden rounded-md">
              <Image
                src="/images (2).jpeg"
                alt="Forest landscape illustrating global forest coverage"
                fill
                sizes="(max-width: 640px) 38vw, 240px"
                className="object-cover"
              />
            </div>
          </Card>

          <Card className="absolute bottom-[2%] right-[1%] w-[45%] rotate-[-2deg] rounded-lg border-4 border-white bg-white shadow-xl transition-transform duration-500 hover:z-20 hover:rotate-0 hover:scale-105 sm:w-[40%]">
            <div className="relative aspect-[1.45] overflow-hidden rounded-md">
              <Image
                src="/images.jpeg"
                alt="EcoSpark volunteers taking part in an outdoor community activity"
                fill
                sizes="(max-width: 640px) 45vw, 280px"
                className="object-cover"
              />
            </div>
            <CardContent className="flex items-center gap-2 px-2.5 py-2 sm:px-3">
              <span className="size-2 rounded-full bg-[#72a34f]" aria-hidden="true" />
              <span className="text-xs font-semibold text-[#244633] sm:text-sm">People make change possible</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}