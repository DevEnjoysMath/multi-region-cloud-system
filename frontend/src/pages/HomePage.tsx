import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Member = {
  key: string;          // 用于找图片文件名
  name: string;         // 展示名字
  role: string;         // 展示角色
};

const members: Member[] = [
  { key: "xiaofan", name: "Xiaofan Bu", role: "Frontend Lead" },
  { key: "ayush", name: "Ayush", role: "Backend Lead" },
  { key: "luke", name: "Luke", role: "DevOps Lead" },
  { key: "daniel", name: "Daniel", role: "Frontend Engineer" },
  { key: "noah", name: "Noah", role: "Frontend Engineer" },
  { key: "erin", name: "Erin", role: "Frontend Engineer" },
  { key: "dev", name: "Dev", role: "Cloud & DevOps Engineer" },
  { key: "darragh", name: "Darragh", role: "Backend Engineer" },
];

function TeamAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mx-auto h-28 w-28 rounded-full border-4 border-orange-500 overflow-hidden bg-white shadow-sm">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
      {/* glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-10 left-10" />
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl bottom-10 right-10" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-14">
        <Card className="bg-white/95 backdrop-blur shadow-xl rounded-2xl">
          <CardHeader className="text-center space-y-3">
            <CardTitle className="text-5xl font-extrabold tracking-tight">
              Group 26
            </CardTitle>

            <p className="text-lg text-gray-600">
              Resilient Multi-Region Cloud-Native Restaurant Ordering System
            </p>

            <p className="text-orange-500 font-semibold">
              In collaboration with Toast
            </p>

            <div className="pt-3 flex flex-wrap justify-center gap-3">
              <Button asChild className="rounded-xl px-6">
                <Link to="/orders">Go to Orders</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl px-6 bg-white">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl px-6 bg-white">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pb-12">
            <h2 className="text-4xl font-extrabold text-center mt-6 mb-10">
              Team &amp; Roles
            </h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((m) => (
                <div
                  key={m.key}
                  className="rounded-2xl bg-gray-50 shadow-md hover:shadow-lg transition p-8 text-center"
                >
                  {/* 关键：public/team 的图片路径 */}
                  <TeamAvatar src={`/team/${m.key}.jpg`} alt={m.name} />

                  <div className="mt-5">
                    <div className="text-xl font-extrabold">{m.name}</div>
                    <div className="mt-1 text-gray-600">{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}