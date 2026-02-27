import AddStory from "@/app/components/AddStory";
import { connectDB } from "@/lib/mongodb";
import { Cat } from "@/models/Cats";

export default async function Page() {
  await connectDB();

const cats = await Cat.find()
  .select("_id name")
  .lean();

  return <AddStory cats={cats} />;
}
