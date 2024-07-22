// get cart

const pipeline = [
    {
      $match: {
        _id: mongoose.Types.ObjectId(cartId),
      },
    },
    {
      $lookup: {
        from: 'movies',
        localField: 'items.movieId',
        foreignField: '_id',
        as: 'movieDetails',
      },
    },
    {
      $unwind: '$movieDetails',
    },
    {
      $project: {
        _id: 0, // exclude the cart's _id from the result
        items: {
          movieId: '$movieDetails._id',
          title: '$movieDetails.title',
          price: '$movieDetails.price',
          coverImage: '$movieDetails.coverImage',
        },
      },
    },
  ];
  
  const cartInfo = await Cart.aggregate(pipeline);