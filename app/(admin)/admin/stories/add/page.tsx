import AddStory from "@/app/container/AddStory";
import { connectDB } from "@/lib/mongodb";
import { Cat } from "@/models/Cats";

export default async function Page() {
  await connectDB();

  const cats = await Cat.find().select("_id name").lean();

  const formatCats = cats.map((cat) => ({
    ...cat,
    _id: cat._id.toString(),
  }));

  return <AddStory cats={formatCats} />;
}
