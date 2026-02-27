import CatView from "@/app/container/CatView";
import { connectDB } from "@/lib/mongodb";
import { Cat } from "@/models/Cats";
import mongoose from "mongoose";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  if (id) {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      // redirect to 404
      return <div>Invalid Id</div>;
    }

    const cat = await Cat.findById(id).lean();

    console.log(cat);
    if (!cat) {
      // redirect to 404
      return <div>Cat not found</div>;
    }
    return (
      <div className="p-6">
        <CatView {...cat} />
      </div>
    );
  }
}
