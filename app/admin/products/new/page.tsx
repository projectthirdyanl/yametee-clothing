import AdminLayout from '@/components/AdminLayout'
import ProductForm from '@/components/ProductForm'

export default function NewProductPage() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Create New Product</h1>
      <ProductForm />
    </AdminLayout>
  )
}
