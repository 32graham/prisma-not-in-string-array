import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample data
  console.log("Creating sample data...");
  await prisma.product.createMany({
    data: [
      {
        title: "Product 1",
        tags: ["Cheap", "Out-of-stock"],
      },
      {
        title: "Product 2",
        tags: ["Cheap"],
      },
      {
        title: "Product 3",
        tags: ["Fun"],
      },
    ],
  });
  console.log("Done creating sample data.");

  // Filtering based on _presence_ of a tag works great
  const cheapProducts = await prisma.product.findMany({
    where: {
      tags: {
        hasEvery: ["Cheap"],
      },
    },
  });
  console.log("Found these cheap products:");
  console.log(cheapProducts);

  // Problem 1: There is no way to filter based on the _absence_ of a tag though.
  // const inStockProducts = await prisma.product.findMany({
  //   where: {
  //     tags: {
  //       hasNone: ["Out-of-stock"]
  //     }
  //   }
  // });
  // console.log("Found these results not tagged as `Out-of-stock`:");
  // console.log(inStockProducts);

  // Problem 2: I also want to filter based on presence and absence at the same time like this mongodb query
  // db.getCollection('Product').find({ tags: { $nin: ['Out-of-stock'], $in: ['Cheap'] }})
  // const cheapInStockProducts = await prisma.product.findMany({
  //   where: {
  //     tags: {
  //       hasEvery: ["Cheap"],
  //       hasNone: ["Out-of-stock"],
  //     },
  //   },
  // });
  // console.log("Found these results not tagged as `Out-of-stock`:");
  // console.log(cheapInStockProducts);

  // cleanup data
  await prisma.product.deleteMany();

  console.log("Done.");
}

main()
  .then(async () => {
    console.log("Disconnecting from db...");
    await prisma.$disconnect();
    console.log("Done disconnecting from db.");
  })
  .catch(async (e) => {
    console.log("Encountered an error:");
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
