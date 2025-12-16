import React, { useRef } from 'react';
import { X, Download, Printer } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import OrderItemReviews from './OrderItemReviews';

const ReceiptModal = ({ order, onClose }) => {
  const receiptRef = useRef(null);

  // Safely extract order data — handle both camelCase and snake_case formats
  const paymentMethod = order?.paymentMethod || order?.payment_method || 'CASH';
  const deliveryMethod = order?.deliveryMethod || order?.delivery_method || 'PICKUP';
  const deliveryAddress = order?.deliveryAddress || order?.delivery_address || 'Store Pickup';
  const phone = order?.phone || 'N/A';
  const orderDate = order?.createdAt || order?.created_at || new Date().toISOString();
  const totalAmount = order?.total || order?.total_amount || 0;

  const handleExportPDF = () => {
    if (!receiptRef.current) return;

    const element = receiptRef.current;
    const opt = {
      margin: 10,
      filename: `receipt-${order.id.slice(-8)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handlePrint = () => {
    if (!receiptRef.current) return;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(receiptRef.current.innerHTML);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <h2 className="text-xl sm:text-2xl font-bold">Receipt</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-5 h-w-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Receipt Content */}
        <div ref={receiptRef} className="p-4 sm:p-8 space-y-4 sm:space-y-6 bg-white">
          {/* Header */}
          <div className="text-center border-b pb-4 sm:pb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Simple Dough</h1>
            <p className="text-sm sm:text-base text-gray-600">Fresh Daily Donuts</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Order Receipt</p>
          </div>

          {/* Order Details */}
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-semibold text-right">#{order.id.slice(-8)}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-gray-600">Date & Time:</span>
              <span className="font-semibold text-right text-xs sm:text-sm">{new Date(orderDate).toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-semibold text-right">{paymentMethod.toUpperCase()}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-gray-600">Delivery Method:</span>
              <span className="font-semibold text-right">{deliveryMethod.toUpperCase()}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-xs sm:text-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
            <div className="space-y-1 text-gray-700">
              <p className="break-words"><span className="font-medium">Phone:</span> {order.phone || 'N/A'}</p>
              <p className="break-words"><span className="font-medium">Address:</span> {(order.delivery_address || order.deliveryAddress || 'Store Pickup')}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Items Ordered</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Item</th>
                    <th className="text-center pb-2">Qty</th>
                    <th className="text-right pb-2">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(order.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 text-gray-700">
                        <div className="break-words">{item.product.name}</div>
                        {item.customizations?.flavors?.length > 0 && (
                          <div className="text-xs text-gray-600 break-words">Flavors: {item.customizations.flavors.join(', ')}</div>
                        )}
                      </td>
                      <td className="py-2 text-center text-gray-700">{item.quantity}</td>
                      <td className="py-2 text-right text-gray-700 whitespace-nowrap">₱{item.totalPrice || item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t pt-3 sm:pt-4 space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between gap-2">
              <span>Subtotal:</span>
              <span className="font-medium">₱{(order.total_amount || order.total) - ((order.delivery_method || order.deliveryMethod) === 'delivery' ? 50 : 0)}</span>
            </div>
            {(order.delivery_method || order.deliveryMethod) === 'delivery' && (
              <div className="flex justify-between gap-2">
                <span>Delivery Fee:</span>
                <span className="font-medium">₱50</span>
              </div>
            )}
            <div className="flex justify-between gap-2 text-sm sm:text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-amber-600">₱{order.total_amount || order.total}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center border-t pt-3 sm:pt-4 text-xs text-gray-600">
            <p>Thank you for your order!</p>
            <p>Please keep this receipt for your records.</p>
          </div>

          {/* Reviews mode: when modal opened from Order History to leave reviews */}
          {order && order._showReviews && (
            <div className="mt-4 p-4 bg-white border-t">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Leave Reviews for This Order</h3>
              <OrderItemReviews order={order} />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-3 sm:p-6 border-t bg-gray-50 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={handleExportPDF}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 sm:py-3 px-3 sm:px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Export as PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2 sm:py-3 px-3 sm:px-6 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Print</span>
            <span className="sm:hidden">Print</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2 sm:py-3 px-3 sm:px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
