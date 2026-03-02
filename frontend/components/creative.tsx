"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Award,
  Bell,
  BookOpen,
  Bookmark,
  Brush,
  Camera,
  ChevronDown,
  Cloud,
  Code,
  Crown,
  Download,
  FileText,
  Globe,
  Grid,
  Heart,
  Home,
  ImageIcon,
  Layers,
  LayoutGrid,
  Lightbulb,
  Map,
  Menu,
  MessageSquare,
  Monitor,
  Moon,
  Palette,
  PanelLeft,
  PenTool,
  Play,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  Star,
  Sun,
  Trash,
  TrendingUp,
  Trophy,
  User,
  Users,
  Video,
  Wand2,
  Clock,
  Eye,
  Archive,
  ArrowUpDown,
  MoreHorizontal,
  Type,
  CuboidIcon,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Sample data for apps
const apps = [
  {
    name: "PixelMaster",
    icon: <ImageIcon className="text-violet-500" />,
    description: "Advanced image editing and composition",
    category: "Creative",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "VectorPro",
    icon: <Brush className="text-orange-500" />,
    description: "Professional vector graphics creation",
    category: "Creative",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "VideoStudio",
    icon: <Video className="text-pink-500" />,
    description: "Cinematic video editing and production",
    category: "Video",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "MotionFX",
    icon: <Sparkles className="text-blue-500" />,
    description: "Stunning visual effects and animations",
    category: "Video",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "PageCraft",
    icon: <Layers className="text-red-500" />,
    description: "Professional page design and layout",
    category: "Creative",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "UXFlow",
    icon: <LayoutGrid className="text-fuchsia-500" />,
    description: "Intuitive user experience design",
    category: "Design",
    recent: false,
    new: true,
    progress: 85,
  },
  {
    name: "PhotoLab",
    icon: <Camera className="text-blue-500" />,
    description: "Advanced photo editing and organization",
    category: "Photography",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "DocMaster",
    icon: <FileText className="text-red-600" />,
    description: "Document editing and management",
    category: "Document",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "WebCanvas",
    icon: <Code className="text-blue-500" />,
    description: "Web design and development",
    category: "Web",
    recent: false,
    new: true,
    progress: 70,
  },
  {
    name: "3DStudio",
    icon: <CuboidIcon className="text-indigo-500" />,
    description: "3D modeling and rendering",
    category: "3D",
    recent: false,
    new: true,
    progress: 60,
  },
  {
    name: "FontForge",
    icon: <Type className="text-amber-500" />,
    description: "Typography and font creation",
    category: "Typography",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "ColorPalette",
    icon: <Palette className="text-purple-500" />,
    description: "Color scheme creation and management",
    category: "Design",
    recent: false,
    new: false,
    progress: 100,
  },
]

// Sample data for recent files
const recentFiles = [
  {
    name: "Brand Redesign.pxm",
    app: "PixelMaster",
    modified: "2 hours ago",
    icon: <ImageIcon className="text-violet-500" />,
    shared: true,
    size: "24.5 MB",
    collaborators: 3,
  },
  {
    name: "Company Logo.vec",
    app: "VectorPro",
    modified: "Yesterday",
    icon: <Brush className="text-orange-500" />,
    shared: true,
    size: "8.2 MB",
    collaborators: 2,
  },
  {
    name: "Product Launch Video.vid",
    app: "VideoStudio",
    modified: "3 days ago",
    icon: <Video className="text-pink-500" />,
    shared: false,
    size: "1.2 GB",
    collaborators: 0,
  },
  {
    name: "UI Animation.mfx",
    app: "MotionFX",
    modified: "Last week",
    icon: <Sparkles className="text-blue-500" />,
    shared: true,
    size: "345 MB",
    collaborators: 4,
  },
  {
    name: "Magazine Layout.pgc",
    app: "PageCraft",
    modified: "2 weeks ago",
    icon: <Layers className="text-red-500" />,
    shared: false,
    size: "42.8 MB",
    collaborators: 0,
  },
  {
    name: "Mobile App Design.uxf",
    app: "UXFlow",
    modified: "3 weeks ago",
    icon: <LayoutGrid className="text-fuchsia-500" />,
    shared: true,
    size: "18.3 MB",
    collaborators: 5,
  },
  {
    name: "Product Photography.phl",
    app: "PhotoLab",
    modified: "Last month",
    icon: <Camera className="text-blue-500" />,
    shared: false,
    size: "156 MB",
    collaborators: 0,
  },
]

// Sample data for projects
const projects = [
  {
    name: "Website Redesign",
    description: "Complete overhaul of company website",
    progress: 75,
    dueDate: "June 15, 2025",
    members: 4,
    files: 23,
  },
  {
    name: "Mobile App Launch",
    description: "Design and assets for new mobile application",
    progress: 60,
    dueDate: "July 30, 2025",
    members: 6,
    files: 42,
  },
  {
    name: "Brand Identity",
    description: "New brand guidelines and assets",
    progress: 90,
    dueDate: "May 25, 2025",
    members: 3,
    files: 18,
  },
  {
    name: "Marketing Campaign",
    description: "Summer promotion materials",
    progress: 40,
    dueDate: "August 10, 2025",
    members: 5,
    files: 31,
  },
]

// Sample data for tutorials
const tutorials = [
  {
    title: "Mastering Digital Illustration",
    description: "Learn advanced techniques for creating stunning digital art",
    duration: "1h 45m",
    level: "Advanced",
    instructor: "Sarah Chen",
    category: "Illustration",
    views: "24K",
  },
  {
    title: "UI/UX Design Fundamentals",
    description: "Essential principles for creating intuitive user interfaces",
    duration: "2h 20m",
    level: "Intermediate",
    instructor: "Michael Rodriguez",
    category: "Design",
    views: "56K",
  },
  {
    title: "Video Editing Masterclass",
    description: "Professional techniques for cinematic video editing",
    duration: "3h 10m",
    level: "Advanced",
    instructor: "James Wilson",
    category: "Video",
    views: "32K",
  },
  {
    title: "Typography Essentials",
    description: "Create beautiful and effective typography for any project",
    duration: "1h 30m",
    level: "Beginner",
    instructor: "Emma Thompson",
    category: "Typography",
    views: "18K",
  },
  {
    title: "Color Theory for Designers",
    description: "Understanding color relationships and psychology",
    duration: "2h 05m",
    level: "Intermediate",
    instructor: "David Kim",
    category: "Design",
    views: "41K",
  },
]

// Sample data for community posts
const communityPosts = [
  {
    title: "Minimalist Logo Design",
    author: "Alex Morgan",
    likes: 342,
    comments: 28,
    image: "/placeholder.svg?height=300&width=400",
    time: "2 days ago",
  },
  {
    title: "3D Character Concept",
    author: "Priya Sharma",
    likes: 518,
    comments: 47,
    image: "/placeholder.svg?height=300&width=400",
    time: "1 week ago",
  },
  {
    title: "UI Dashboard Redesign",
    author: "Thomas Wright",
    likes: 276,
    comments: 32,
    image: "/placeholder.svg?height=300&width=400",
    time: "3 days ago",
  },
  {
    title: "Product Photography Setup",
    author: "Olivia Chen",
    likes: 189,
    comments: 15,
    image: "/placeholder.svg?height=300&width=400",
    time: "5 days ago",
  },
]

// Sample data for sidebar navigation
const sidebarItems = [
  {
    title: "Ana Sayfa",
    icon: <Home />,
    isActive: true,
    tabValue: "home",
  },
  {
    title: "Patika",
    icon: <Map />,
    tabValue: "patika",
  },
  {
    title: "Sözlük",
    icon: <BookOpen />,
    tabValue: "sozluk",
  },
  {
    title: "Başarımlar",
    icon: <Trophy />,
    tabValue: "basarimlar",
  },
  {
    title: "Profil",
    icon: <User />,
    tabValue: "profil",
  },
  {
    title: "Blog",
    icon: <PenTool />,
    tabValue: "blog",
  },
]

export function DesignaliCreative() {
  const [progress, setProgress] = useState(0)
  const [notifications, setNotifications] = useState(5)
  const [activeTab, setActiveTab] = useState("home")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsCategory, setSettingsCategory] = useState("general")
  const [themeMode, setThemeMode] = useState("system")
  const [language, setLanguage] = useState("tr")
  const [blogPage, setBlogPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  // Simulate progress loading
  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(120, 41, 190, 0.5) 0%, rgba(53, 71, 125, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 30% 70%, rgba(233, 30, 99, 0.5) 0%, rgba(81, 45, 168, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 70% 30%, rgba(76, 175, 80, 0.5) 0%, rgba(32, 119, 188, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 50% 50%, rgba(120, 41, 190, 0.5) 0%, rgba(53, 71, 125, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
          ],
        }}
        transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar - Mobile */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col border-r">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                <span className="text-lg font-bold">P</span>
              </div>
              <div>
                <h2 className="font-semibold">Parrotingo</h2>
                <p className="text-xs text-muted-foreground">Dil Öğrenim</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <div key={item.title} className="mb-1">
                  <button
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                      activeTab === item.tabValue ? "bg-primary/10 text-primary" : "hover:bg-muted",
                    )}
                    onClick={() => {
                      setActiveTab(item.tabValue)
                      setMobileMenuOpen(false)
                    }}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-3">
            <div className="space-y-1">
              <button
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted"
                onClick={() => {
                  setSettingsOpen(true)
                  setMobileMenuOpen(false)
                }}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden w-64 transform border-r bg-background transition-transform duration-300 ease-in-out md:block",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                <span className="text-lg font-bold">P</span>
              </div>
              <div>
                <h2 className="font-semibold">Parrotingo</h2>
                <p className="text-xs text-muted-foreground">Dil Öğrenim</p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <div key={item.title} className="mb-1">
                  <button
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                      activeTab === item.tabValue ? "bg-primary/10 text-primary" : "hover:bg-muted",
                    )}
                    onClick={() => setActiveTab(item.tabValue)}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-3">
            <div className="space-y-1">
              <button
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn("min-h-screen transition-all duration-300 ease-in-out", sidebarOpen ? "md:pl-64" : "md:pl-0")}>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <PanelLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-xl font-semibold">Parrotingo</h1>
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl relative">
                      <Bell className="h-5 w-5" />
                      {notifications > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                          {notifications}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bildirimler</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Avatar className="h-9 w-9 border-2 border-primary">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Tabs defaultValue="home" value={activeTab} onValueChange={setActiveTab} className="w-full">

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="home" className="space-y-8 mt-0">
                  {/* Your Stats Section */}
                  <section>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 p-8 text-white"
                    >
                      <div className="flex flex-col gap-6 px-24 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-5">
                          <h2 className="text-3xl font-bold underline underline-offset-8 decoration-white/40">Your Stats</h2>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                                <Sparkles className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold">142 soru çözüldü</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                                <BookOpen className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold">312 kelime öğrenildi</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                                <TrendingUp className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold">7 gün girildi</p>
                              </div>
                            </div>
                          </div>
                          <Button
                            className="rounded-2xl bg-white text-blue-700 hover:bg-white/90 px-8 py-6 text-lg"
                            onClick={() => setActiveTab("sozluk")}
                          >
                            <BookOpen className="mr-2 h-5 w-5" />
                            Manage Wordbank
                          </Button>
                        </div>
                        <div className="hidden lg:flex items-center justify-center">
                          <motion.div
                            className="relative flex h-50 w-50 items-center justify-center"
                          >
                            <div className="absolute inset-0" />
                            <img src="/mascot.png" alt="Parrotingo Mascot" className="relative h-48 w-48 object-contain" />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </section>

                  {/* Blog Section */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">Blog</h2>
                      <Button
                        variant="ghost"
                        className="rounded-2xl"
                        onClick={() => setActiveTab("blog")}
                      >
                        Keşfet
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {[
                        {
                          title: "Etkili Kelime Öğrenme Teknikleri",
                          author: "Parrotingo Ekibi",
                          excerpt: "Bilimsel olarak kanıtlanmış 5 teknik ile kelime haznenizi hızla genişletin.",
                          category: "İpuçları",
                          readTime: "5 dk",
                        },
                        {
                          title: "Dil Öğreniminde Motivasyon",
                          author: "Ayşe Yılmaz",
                          excerpt: "Motivasyonunuzu kaybetmemeniz için pratik öneriler.",
                          category: "Motivasyon",
                          readTime: "7 dk",
                        },
                        {
                          title: "Gramer mi Kelime mi?",
                          author: "Mehmet Kaya",
                          excerpt: "Dil öğreniminde öncelik sıralaması ve doğru denge.",
                          category: "Strateji",
                          readTime: "4 dk",
                        },
                        {
                          title: "Günlük Rutinler ile Dil Öğrenimi",
                          author: "Parrotingo Ekibi",
                          excerpt: "Her gün 15 dakikanızı ayırarak nasıl ilerleme kaydedersiniz?",
                          category: "Rehber",
                          readTime: "6 dk",
                        },
                      ].map((post) => (
                        <motion.div key={post.title} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                          <Card className="overflow-hidden rounded-3xl border hover:border-primary/50 transition-all duration-300">
                            <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 flex items-end">
                              <Badge className="rounded-xl bg-blue-500 text-white">{post.category}</Badge>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold">{post.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p>
                              <div className="mt-2 flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{post.author}</span>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {post.readTime}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                </TabsContent>

                {/* Patika Tab - Duolingo Style */}
                <TabsContent value="patika" className="space-y-6 mt-0">
                  <div className="mx-auto max-w-md">
                    {/* Path header */}
                    <div className="mb-8 rounded-2xl bg-blue-500 p-4 text-white">
                      <button className="mb-1 text-sm text-white/80 hover:text-white flex items-center gap-1" onClick={() => setActiveTab("home")}>
                        ← BÖLÜM 1, KISIM 1
                      </button>
                      <h2 className="text-xl font-bold">Temel Selamlaşma</h2>
                    </div>

                    {/* Duolingo-style path nodes */}
                    <div className="flex flex-col items-center gap-4">
                      {[
                        { id: 1, status: "completed", label: "Merhaba!" },
                        { id: 2, status: "completed", label: "Nasılsın?" },
                        { id: 3, status: "current", label: "BAŞLA" },
                        { id: 4, status: "locked", label: "" },
                        { id: 5, status: "locked", label: "" },
                        { id: 6, status: "locked", label: "" },
                        { id: 7, status: "chest", label: "" },
                      ].map((node, index) => (
                        <motion.div
                          key={node.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          style={{ marginLeft: `${Math.sin(index * 0.8) * 60}px` }}
                          className="relative"
                        >
                          {node.status === "completed" && (
                            <button className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-transform hover:scale-110">
                              <Star className="h-7 w-7 fill-white" />
                            </button>
                          )}
                          {node.status === "current" && (
                            <div className="flex flex-col items-center gap-2">
                              <motion.button
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-white shadow-xl shadow-blue-300 dark:shadow-blue-900/40 ring-4 ring-blue-200 dark:ring-blue-800"
                              >
                                <span className="text-sm font-bold">{node.label}</span>
                              </motion.button>
                            </div>
                          )}
                          {node.status === "locked" && (
                            <button className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-md cursor-not-allowed">
                              <Star className="h-7 w-7" />
                            </button>
                          )}
                          {node.status === "chest" && (
                            <button className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-md cursor-not-allowed">
                              <Trophy className="h-7 w-7" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Sözlük Tab - Word List */}
                <TabsContent value="sozluk" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="text-2xl font-bold">Sözlük</h2>
                      <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Kelime ara..."
                          className="rounded-2xl pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border overflow-hidden">
                      {/* Table header */}
                      <div className="grid grid-cols-3 gap-4 border-b bg-muted/50 px-6 py-3 text-sm font-medium text-muted-foreground">
                        <span>İngilizce</span>
                        <span>Türkçe</span>
                        <span className="text-right">Seviye</span>
                      </div>

                      {/* Word rows */}
                      {[
                        { en: "Serendipity", tr: "Beklenmedik güzel keşif", level: "B2", pronunciation: "/ˌserənˈdɪpɪti/" },
                        { en: "Eloquent", tr: "Güzel konuşan, belagatli", level: "C1", pronunciation: "/ˈeləkwənt/" },
                        { en: "Perseverance", tr: "Azim, sebat", level: "B2", pronunciation: "/ˌpɜːrsəˈvɪrəns/" },
                      ].map((word) => (
                        <motion.div
                          key={word.en}
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                          className="grid grid-cols-3 gap-4 items-center border-b last:border-b-0 px-6 py-4 transition-colors"
                        >
                          <div>
                            <p className="font-semibold">{word.en}</p>
                            <p className="text-xs text-muted-foreground">{word.pronunciation}</p>
                          </div>
                          <p className="text-sm">{word.tr}</p>
                          <div className="flex justify-end">
                            <Badge variant="outline" className="rounded-xl">{word.level}</Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Başarımlar Tab - Achievement Rows */}
                <TabsContent value="basarimlar" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Başarımlar</h2>

                    <div className="space-y-3">
                      {[
                        { name: "İlk Adım", desc: "İlk dersini tamamla", icon: <Star className="h-6 w-6 text-amber-500" />, status: "completed" },
                        { name: "Kelime Avcısı", desc: "50 kelime öğren", icon: <BookOpen className="h-6 w-6 text-blue-500" />, status: "completed" },
                        { name: "Haftanın Yıldızı", desc: "7 gün üst üste çalış", icon: <TrendingUp className="h-6 w-6 text-blue-500" />, status: "claim" },
                        { name: "Mükemmeliyetçi", desc: "Bir dersten %100 al", icon: <Award className="h-6 w-6 text-violet-500" />, status: "claim" },
                        { name: "Sosyal Kelebek", desc: "5 arkadaş ekle", icon: <Users className="h-6 w-6 text-pink-500" />, status: "locked" },
                        { name: "Maraton Koşucusu", desc: "30 gün üst üste çalış", icon: <Trophy className="h-6 w-6 text-orange-500" />, status: "locked" },
                        { name: "Sözlük Ustası", desc: "500 kelime öğren", icon: <Sparkles className="h-6 w-6 text-sky-500" />, status: "locked" },
                        { name: "Dil Dahisi", desc: "Tüm A1 patikasını bitir", icon: <Globe className="h-6 w-6 text-indigo-500" />, status: "locked" },
                      ].map((achievement) => (
                        <motion.div
                          key={achievement.name}
                          whileHover={{ scale: 1.01 }}
                          className={cn(
                            "flex items-center gap-4 rounded-2xl border p-4 transition-all",
                            achievement.status === "locked" ? "opacity-50" : ""
                          )}
                        >
                          <div className={cn(
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                            achievement.status === "completed" ? "bg-amber-100 dark:bg-amber-900/30" :
                              achievement.status === "claim" ? "bg-blue-100 dark:bg-blue-900/30" :
                                "bg-muted"
                          )}>
                            {achievement.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold">{achievement.name}</p>
                            <p className="text-sm text-muted-foreground">{achievement.desc}</p>
                          </div>
                          {achievement.status === "completed" && (
                            <Badge className="shrink-0 rounded-xl bg-amber-500 text-white">
                              ✓ Tamamlandı
                            </Badge>
                          )}
                          {achievement.status === "claim" && (
                            <Button size="sm" className="shrink-0 rounded-xl bg-blue-500 hover:bg-blue-600 text-white">
                              Ödül Al
                            </Button>
                          )}
                          {achievement.status === "locked" && (
                            <Badge variant="outline" className="shrink-0 rounded-xl text-muted-foreground">
                              🔒 Kilitli
                            </Badge>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Profil Tab */}
                <TabsContent value="profil" className="space-y-6 mt-0">
                  <div className="space-y-6">
                    {/* Profile header card */}
                    <div className="rounded-3xl border bg-card p-6">
                      <div className="flex flex-col items-center gap-4 sm:flex-row">
                        <Avatar className="h-20 w-20 ring-4 ring-blue-200 dark:ring-blue-800">
                          <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User" />
                          <AvatarFallback className="text-2xl">JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center sm:text-left">
                          <h2 className="text-2xl font-bold">John Doe</h2>
                          <p className="text-muted-foreground">İngilizce öğreniyor • 30 gündür üye</p>
                          <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                            <Badge className="rounded-xl bg-blue-500 text-white">A2 Seviye</Badge>
                            <Badge variant="outline" className="rounded-xl">12 Rozet</Badge>
                            <Badge variant="outline" className="rounded-xl">2.4K XP</Badge>
                          </div>
                        </div>
                        <Button variant="outline" className="rounded-2xl" onClick={() => setSettingsOpen(true)}>
                          Profili Düzenle
                        </Button>
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { label: "Toplam Ders", value: "48", icon: <BookOpen className="h-5 w-5 text-blue-500" /> },
                        { label: "Kelime", value: "312", icon: <PenTool className="h-5 w-5 text-blue-500" /> },
                        { label: "Çalışma Saati", value: "24h", icon: <Clock className="h-5 w-5 text-violet-500" /> },
                        { label: "En Uzun Seri", value: "14 gün", icon: <TrendingUp className="h-5 w-5 text-amber-500" /> },
                      ].map((stat) => (
                        <Card key={stat.label} className="rounded-2xl p-4 text-center">
                          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                            {stat.icon}
                          </div>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </Card>
                      ))}
                    </div>

                    {/* Recent activity */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Son Aktiviteler</h3>
                      <div className="rounded-2xl border overflow-hidden">
                        {[
                          { action: "A1 Patikası - Ders 5 tamamlandı", time: "2 saat önce", icon: <Map className="h-4 w-4 text-blue-500" /> },
                          { action: "15 yeni kelime öğrenildi", time: "Dün", icon: <BookOpen className="h-4 w-4 text-blue-500" /> },
                          { action: "7 Gün Seri rozeti kazanıldı", time: "3 gün önce", icon: <Trophy className="h-4 w-4 text-amber-500" /> },
                          { action: "Günlük Konuşma dersine başlandı", time: "1 hafta önce", icon: <PenTool className="h-4 w-4 text-violet-500" /> },
                        ].map((activity) => (
                          <div key={activity.action} className="flex items-center gap-3 border-b last:border-b-0 px-4 py-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                              {activity.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{activity.action}</p>
                              <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Blog Tab - List with Pagination */}
                <TabsContent value="blog" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="text-2xl font-bold">Blog</h2>
                      <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Blog yazısı ara..."
                          className="rounded-2xl pl-9"
                        />
                      </div>
                    </div>

                    {/* Blog list */}
                    <div className="space-y-3">
                      {[
                        { title: "Etkili Kelime Öğrenme Teknikleri", excerpt: "Bilimsel olarak kanıtlanmış 5 teknik ile kelime haznenizi hızla genişletin.", category: "İpuçları", readTime: "5 dk", date: "20 Şub 2026", author: "Parrotingo Ekibi" },
                        { title: "Dil Öğreniminde Motivasyon", excerpt: "Motivasyonunuzu kaybetmemeniz için pratik öneriler ve günlük rutinler.", category: "Motivasyon", readTime: "7 dk", date: "18 Şub 2026", author: "Ayşe Yılmaz" },
                        { title: "Gramer mi Kelime mi?", excerpt: "Dil öğreniminde öncelik sıralaması ve doğru denge nasıl kurulur?", category: "Strateji", readTime: "4 dk", date: "15 Şub 2026", author: "Mehmet Kaya" },
                        { title: "Günlük Rutinler ile Dil Öğrenimi", excerpt: "Her gün 15 dakikanızı ayırarak nasıl ilerleme kaydedersiniz?", category: "Rehber", readTime: "6 dk", date: "12 Şub 2026", author: "Parrotingo Ekibi" },
                        { title: "Dinleme Becerinizi Geliştirin", excerpt: "Podcast ve müzik ile İngilizce dinleme pratiği yapmanın yolları.", category: "İpuçları", readTime: "5 dk", date: "10 Şub 2026", author: "Zeynep Demir" },
                        { title: "Spaced Repetition Tekniği", excerpt: "Aralıklı tekrar yöntemi ile öğrendiklerinizi kalıcı hale getirin.", category: "Bilim", readTime: "8 dk", date: "8 Şub 2026", author: "Parrotingo Ekibi" },
                        { title: "Yeni Başlayanlar İçin İpuçları", excerpt: "Dil öğrenimine sıfırdan başlayanlar için 10 altın kural.", category: "Başlangıç", readTime: "6 dk", date: "5 Şub 2026", author: "Ali Vural" },
                        { title: "Film ve Dizi ile Öğrenme", excerpt: "En sevdiğiniz yapımları izleyerek İngilizce öğrenmenin etkili yolları.", category: "Eğlence", readTime: "5 dk", date: "3 Şub 2026", author: "Parrotingo Ekibi" },
                        { title: "Yazma Pratiği Rehberi", excerpt: "Günlük tutmaktan blog yazmaya: yazarak öğrenme stratejileri.", category: "Rehber", readTime: "7 dk", date: "1 Şub 2026", author: "Selin Aksoy" },
                        { title: "Telaffuz Geliştirme Teknikleri", excerpt: "Native speaker gibi konuşmak için shadowing ve diğer teknikler.", category: "Konuşma", readTime: "6 dk", date: "28 Oca 2026", author: "Parrotingo Ekibi" },
                        { title: "Sınav Hazırlık Stratejileri", excerpt: "IELTS, TOEFL ve Cambridge sınavlarına etkili hazırlık yöntemleri.", category: "Sınav", readTime: "9 dk", date: "25 Oca 2026", author: "Burak Yıldız" },
                        { title: "Çocuklarla Birlikte Dil Öğrenimi", excerpt: "Ailenizle birlikte eğlenceli aktivitelerle dil öğrenmenin yolları.", category: "Aile", readTime: "5 dk", date: "22 Oca 2026", author: "Parrotingo Ekibi" },
                      ]
                        .slice((blogPage - 1) * 12, blogPage * 12)
                        .map((post) => (
                          <motion.div key={post.title} whileHover={{ scale: 1.005 }} className="group">
                            <div className="flex gap-4 rounded-2xl border p-4 transition-colors hover:border-primary/40">
                              <div className="hidden sm:flex h-20 w-28 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                                <Badge className="rounded-lg bg-blue-500 text-white text-xs">{post.category}</Badge>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="font-semibold group-hover:text-primary transition-colors">{post.title}</h3>
                                  <Badge variant="outline" className="shrink-0 rounded-lg text-xs sm:hidden">{post.category}</Badge>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                                  <span>{post.author}</span>
                                  <span>•</span>
                                  <span>{post.date}</span>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {post.readTime}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        disabled={blogPage === 1}
                        onClick={() => setBlogPage(blogPage - 1)}
                      >
                        ← Önceki
                      </Button>
                      {[1, 2, 3].map((page) => (
                        <Button
                          key={page}
                          variant={blogPage === page ? "default" : "outline"}
                          size="sm"
                          className="rounded-xl h-9 w-9 p-0"
                          onClick={() => setBlogPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        disabled={blogPage === 3}
                        onClick={() => setBlogPage(blogPage + 1)}
                      >
                        Sonraki →
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </main >
      </div >

      {/* Settings Modal */}
      < Dialog open={settingsOpen} onOpenChange={setSettingsOpen} >
        <DialogContent className="sm:max-w-[550px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Ayarlar</DialogTitle>
            <DialogDescription>Uygulama ayarlarınızı buradan yönetin.</DialogDescription>
          </DialogHeader>

          <div className="flex gap-2 border-b pb-4">
            {[
              { key: "general", label: "Genel", icon: <Settings className="h-4 w-4" /> },
              { key: "preferences", label: "Tercihler", icon: <Sparkles className="h-4 w-4" /> },
              { key: "account", label: "Hesap", icon: <User className="h-4 w-4" /> },
            ].map((cat) => (
              <Button
                key={cat.key}
                variant={settingsCategory === cat.key ? "default" : "outline"}
                className="rounded-2xl flex items-center gap-2 text-sm"
                onClick={() => setSettingsCategory(cat.key)}
              >
                {cat.icon}
                {cat.label}
              </Button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={settingsCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6 py-4"
            >
              {settingsCategory === "general" && (
                <>
                  {/* Theme */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Tema Rengi</Label>
                    <div className="flex gap-2">
                      {[
                        { value: "light", label: "Açık", icon: <Sun className="h-4 w-4" /> },
                        { value: "dark", label: "Koyu", icon: <Moon className="h-4 w-4" /> },
                        { value: "system", label: "Sistem", icon: <Monitor className="h-4 w-4" /> },
                      ].map((theme) => (
                        <Button
                          key={theme.value}
                          variant={themeMode === theme.value ? "default" : "outline"}
                          className="flex-1 rounded-2xl flex items-center justify-center gap-2"
                          onClick={() => setThemeMode(theme.value)}
                        >
                          {theme.icon}
                          {theme.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Language */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Dil Seçimi</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="rounded-2xl">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <SelectValue placeholder="Dil seçin" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="tr" className="rounded-xl">
                          🇹🇷 Türkçe
                        </SelectItem>
                        <SelectItem value="en" className="rounded-xl">
                          🇬🇧 English
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {settingsCategory === "preferences" && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-2xl border p-4">
                      <div>
                        <p className="font-medium">Bildirimler</p>
                        <p className="text-sm text-muted-foreground">Günlük hatırlatma bildirimleri</p>
                      </div>
                      <Button variant="outline" className="rounded-2xl">Açık</Button>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border p-4">
                      <div>
                        <p className="font-medium">Ses Efektleri</p>
                        <p className="text-sm text-muted-foreground">Doğru/yanlış cevap sesleri</p>
                      </div>
                      <Button variant="outline" className="rounded-2xl">Açık</Button>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border p-4">
                      <div>
                        <p className="font-medium">Günlük Hedef</p>
                        <p className="text-sm text-muted-foreground">Günlük kelime öğrenim hedefi</p>
                      </div>
                      <Select defaultValue="10">
                        <SelectTrigger className="w-[100px] rounded-2xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="5" className="rounded-xl">5 kelime</SelectItem>
                          <SelectItem value="10" className="rounded-xl">10 kelime</SelectItem>
                          <SelectItem value="20" className="rounded-xl">20 kelime</SelectItem>
                          <SelectItem value="30" className="rounded-xl">30 kelime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {settingsCategory === "account" && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 rounded-2xl border p-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="/placeholder.svg?height=64&width=64" alt="User" />
                        <AvatarFallback className="text-xl">JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-lg">John Doe</p>
                        <p className="text-sm text-muted-foreground">john.doe@email.com</p>
                      </div>
                      <Button variant="outline" className="rounded-2xl">Düzenle</Button>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">E-posta</Label>
                      <Input className="rounded-2xl" defaultValue="john.doe@email.com" />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Kullanıcı Adı</Label>
                      <Input className="rounded-2xl" defaultValue="johndoe" />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" className="flex-1 rounded-2xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                        Hesabı Sil
                      </Button>
                      <Button className="flex-1 rounded-2xl">
                        Değişiklikleri Kaydet
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog >
    </div >
  )
}

