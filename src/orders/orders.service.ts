@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      // Calculate total and validate inventory
      const total = await this.calculateOrderTotal(createOrderDto.items);
      
      const order = await tx.order.create({
        data: {
          total,
          customerName: createOrderDto.customerName,
          customerPhone: createOrderDto.customerPhone,
          coordinates: createOrderDto.coordinates,
          items: {
            create: createOrderDto.items.map(item => ({
              quantity: item.quantity,
              price: item.price,
              productId: item.productId
            }))
          }
        },
        include: { items: true }
      });

      // Update inventory
      await Promise.all(createOrderDto.items.map(item =>
        tx.product.update({
          where: { id: item.productId },
          data: { inventory: { decrement: item.quantity } }
        })
      ));

      return order;
    });
  }
} 