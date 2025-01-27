import { env } from "@/env";
import { Xendit, type Invoice } from "xendit-node";
import type {
  CreateInvoiceRequest,
  Invoice as InvoiceResponse,
} from "xendit-node/invoice/models";

class XenditService {
  private static instance: XenditService | null = null;
  private readonly xenditClient: Xendit;
  private readonly invoiceClient: Invoice;

  private constructor() {
    if (typeof window !== "undefined") {
      throw new Error(
        "XenditService can only be initialized on the server side",
      );
    }

    this.xenditClient = new Xendit({
      secretKey: env.XENDIT_SECRET_KEY,
    });
    this.invoiceClient = this.xenditClient.Invoice;
  }

  public static getInstance(): XenditService {
    if (typeof window !== "undefined") {
      throw new Error("XenditService can only be used on the server side");
    }

    if (!XenditService.instance) {
      XenditService.instance = new XenditService();
    }

    return XenditService.instance;
  }

  public async createInvoice(
    params: CreateInvoiceRequest,
  ): Promise<InvoiceResponse> {
    try {
      const response = await this.invoiceClient.createInvoice({
        data: params,
      });

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create invoice: ${error.message}`);
      }
      throw new Error("Failed to create invoice: Unknown error");
    }
  }

  public async getInvoice(invoiceId: string): Promise<InvoiceResponse> {
    try {
      const response = await this.invoiceClient.getInvoiceById({
        invoiceId,
      });

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get invoice: ${error.message}`);
      }
      throw new Error("Failed to get invoice: Unknown error");
    }
  }
}

export const getXenditService = (): XenditService => {
  return XenditService.getInstance();
};
