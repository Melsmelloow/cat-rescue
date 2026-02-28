"use client";
import { ICat } from "@/models/Cats";
import { motion } from "framer-motion";
import { FC } from "react";
import CatCard from "./CatCard";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface CatListProps {
  cats: ICat[];
}

const CatList: FC<CatListProps> = ({ cats }) => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
      {cats.map((cat: any, index: number) => (
        <motion.div
          key={cat._id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
          }}
          viewport={{ once: true }}
          onClick={() => {
            const redirectURL = session
              ? `/admin/cats/view/${cat._id}`
              : `/cats/view/${cat._id}`;
            router.push(redirectURL);
          }}
        >
          <CatCard {...cat} />
        </motion.div>
      ))}
    </div>
  );
};

export default CatList;
