import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { userCart } from "../db/schema";
import { TRPCError } from "@trpc/server";

export async function getUserCart(userId: string) {
  const data = await db.query.userCart.findMany({
    where: eq(userCart.userId, userId),
    with: {
      items: true,
    },
  });

  return data;
}

export async function getUserCartItems(userId: string, itemsId: string) {
  const data = await db.query.userCart.findFirst({
    where: and(eq(userCart.userId, userId), eq(userCart.itemId, itemsId)),
    with: {
      items: true,
    },
  });

  return data;
}

export async function getUserCartCount(userId: string) {
  const data = await db.query.userCart.findMany({
    where: eq(userCart.userId, userId),
  });

  return data.length;
}

export async function getUserCartTotal(userId: string) {
  const data = await db.query.userCart.findMany({
    where: eq(userCart.userId, userId),
    with: {
      items: true,
    },
  });

  return data.reduce(
    (acc, item) => acc + item.quantity * (item.items?.price ?? 0),
    0,
  );
}

export async function addItemToCart(
  userId: string,
  itemId: string,
  qty: number,
) {
  const isExists = await getUserCartItems(userId, itemId);

  if (isExists) {
    return updateCartItemQuantity(userId, itemId, isExists.quantity + qty);
  }

  const [cartItem] = await db
    .insert(userCart)
    .values({
      userId,
      itemId,
      quantity: qty,
    })
    .returning()
    .execute();

  if (!cartItem) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to add item to cart",
    });
  }

  return cartItem;
}

export async function updateCartItemQuantity(
  userId: string,
  itemId: string,
  qty: number,
) {
  const isExists = await getUserCartItems(userId, itemId);

  if (!isExists) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Item not found in cart",
    });
  }

  const cartItem = await db
    .update(userCart)
    .set({
      quantity: qty,
    })
    .where(and(eq(userCart.userId, userId), eq(userCart.itemId, itemId)))
    .returning()
    .execute();

  if (!cartItem) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update item quantity",
    });
  }

  return cartItem;
}

export async function removeItemFromCart(userId: string, itemId: string) {
  const isExists = await getUserCartItems(userId, itemId);

  if (!isExists) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Item not found in cart",
    });
  }

  const cartItem = await db
    .delete(userCart)
    .where(and(eq(userCart.userId, userId), eq(userCart.itemId, itemId)))
    .returning()
    .execute();

  if (!cartItem) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to remove item from cart",
    });
  }

  return cartItem;
}

export async function clearUserCart(userId: string) {
  const cartItems = await db
    .delete(userCart)
    .where(eq(userCart.userId, userId))
    .returning()
    .execute();

  if (!cartItems) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to clear cart",
    });
  }

  return cartItems;
}
