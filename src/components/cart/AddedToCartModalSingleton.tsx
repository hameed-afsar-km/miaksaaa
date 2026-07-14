"use client";
import { useAddedToCartModal } from "@/lib/store/addedToCartModalStore";
import { AddedToCartModal } from "@/components/cart/AddedToCartModal";
import { useRouter } from "next/navigation";

export function AddedToCartModalSingleton() {
  const { isOpen, item, closeModal } = useAddedToCartModal();
  const router = useRouter();

  return (
    <AddedToCartModal
      isOpen={isOpen}
      onClose={closeModal}
      onGoToCart={() => { closeModal(); router.push("/cart"); }}
      item={item}
    />
  );
}
