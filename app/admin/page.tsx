// "use client"

// import { useState, useEffect } from "react"
// import { getAllArtPieces } from "@/lib/database"
// import { ThemeToggle } from "@/components/theme-toggle"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { CheckCircle, Home, Palette, Trash2, Eye } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { useToast } from "@/hooks/use-toast"
// import type { ArtPiece } from "@/types"
// import { SetupGuide } from "@/components/setup-guide"

// export default function AdminPage() {
//   const [artPieces, setArtPieces] = useState<ArtPiece[]>([])
//   const [loading, setLoading] = useState(true)
//   const { toast } = useToast()

//   useEffect(() => {
//     loadArtPieces()
//   }, [])

//   const loadArtPieces = async () => {
//     try {
//       const pieces = await getAllArtPieces()
//       setArtPieces(pieces)
//     } catch (error) {
//       console.error("Error loading art pieces:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load art pieces.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleApprove = async (id: string) => {
//     try {
//       const response = await fetch("/api/admin/approve", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to approve")
//       }

//       await loadArtPieces()
//       toast({
//         title: "Approved",
//         description: "Art piece has been approved and sent to subscribers.",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to approve art piece.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this art piece?")) return

//     try {
//       const response = await fetch(`/api/admin/delete`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to delete")
//       }

//       await loadArtPieces()
//       toast({
//         title: "Deleted",
//         description: "Art piece has been deleted.",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete art piece.",
//         variant: "destructive",
//       })
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//           <p>Loading admin dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <header className="border-b">
//         <div className="container flex h-16 items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Palette className="h-6 w-6" />
//             <h1 className="text-xl font-bold">Inbox-as-Art</h1>
//           </div>
//           <div className="flex items-center gap-4">
//             <Link href="/">
//               <Button variant="ghost" className="gap-1">
//                 <Home className="h-4 w-4" />
//                 Home
//               </Button>
//             </Link>
//             <Link href="/wall">
//               <Button variant="ghost">Art Wall</Button>
//             </Link>
//             <ThemeToggle />
//           </div>
//         </div>
//       </header>

//       <main className="flex-1 container py-8">
//         <div className="flex flex-col items-start space-y-4 mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Admin Dashboard</h1>
//           <p className="text-muted-foreground">
//             Manage and moderate the art pieces generated from emails and voice messages.
//           </p>
//           <SetupGuide />
//           <div className="flex gap-4 text-sm">
//             <Badge variant="outline">Total: {artPieces.length}</Badge>
//             <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
//               Approved: {artPieces.filter((p) => p.approved).length}
//             </Badge>
//             <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
//               Pending: {artPieces.filter((p) => !p.approved).length}
//             </Badge>
//           </div>
//         </div>

//         <div className="rounded-md border">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Type</TableHead>
//                 <TableHead>Content</TableHead>
//                 <TableHead>Source</TableHead>
//                 <TableHead>Created</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {artPieces.map((piece) => (
//                 <TableRow key={piece.id}>
//                   <TableCell>
//                     <Badge variant="outline" className="capitalize">
//                       {piece.type}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="max-w-[300px]">
//                     <div className="truncate">
//                       {piece.type === "image" ? (
//                         <div className="flex items-center gap-2">
//                           <Eye className="h-4 w-4" />
//                           <span className="text-sm">{piece.content}</span>
//                         </div>
//                       ) : (
//                         <span className="text-sm">{piece.content}</span>
//                       )}
//                     </div>
//                   </TableCell>
//                   <TableCell>{piece.anonymous ? "Anonymous" : piece.source_email}</TableCell>
//                   <TableCell>{new Date(piece.created_at).toLocaleDateString()}</TableCell>
//                   <TableCell>
//                     {piece.approved ? (
//                       <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
//                         Approved
//                       </Badge>
//                     ) : (
//                       <Badge
//                         variant="destructive"
//                         className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
//                       >
//                         Pending
//                       </Badge>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex space-x-2">
//                       {!piece.approved && (
//                         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleApprove(piece.id)}>
//                           <CheckCircle className="h-4 w-4 text-green-500" />
//                         </Button>
//                       )}
//                       <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(piece.id)}>
//                         <Trash2 className="h-4 w-4 text-red-500" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </main>

//       <footer className="border-t py-6">
//         <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <p className="text-sm text-muted-foreground">
//             © {new Date().getFullYear()} Inbox-as-Art. All rights reserved.
//           </p>
//           <div className="flex gap-4">
//             <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
//               Privacy Policy
//             </Link>
//             <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
//               Terms of Service
//             </Link>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }
