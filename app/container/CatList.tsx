"use client";
import { ICat } from "@/models/Cats";
import { motion } from "framer-motion";
import Link from "next/link";
import { FC } from "react";
import CatCard from "./CatCard";

interface CatListProps {
  cats: ICat[];
}

const CatList: FC<CatListProps> = ({ cats }) => {

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
      {cats.map((cat: any, index: number) => (
        <Link href={`/cats/view/${cat._id}`}>
          <motion.div
            key={cat._id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
            }}
            viewport={{ once: true }}
          >
            <CatCard {...cat} />
          </motion.div>
        </Link>
      ))}
    </div>
  );
};

export default CatList;
