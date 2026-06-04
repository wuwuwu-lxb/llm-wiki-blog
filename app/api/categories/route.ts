import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth";
import { createCategory, listCategories } from "@/lib/db";

export async function GET() {
  if (!(await requireApiUser())) {
    return NextResponse.json({ error: "未登录。" }, { status: 401 });
  }

  return NextResponse.json({
    categories: listCategories(),
  });
}

export async function POST(request: Request) {
  if (!(await requireApiUser())) {
    return NextResponse.json({ error: "未登录。" }, { status: 401 });
  }

  const payload = (await request.json()) as {
    name?: string;
    description?: string;
  };

  const name = payload.name?.trim();

  if (!name) {
    return NextResponse.json({ error: "分类名称不能为空。" }, { status: 400 });
  }

  return NextResponse.json(
    {
      category: createCategory(name, payload.description ?? ""),
    },
    { status: 201 },
  );
}
