"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BlogPostCard } from "@/components/ui/blog-post-card"

const allBlogPosts = [
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

const POSTS_PER_PAGE = 12

export default function BlogPage() {
    const [blogPage, setBlogPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")

    const filteredPosts = allBlogPosts.filter(
        (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE))
    const paginatedPosts = filteredPosts.slice((blogPage - 1) * POSTS_PER_PAGE, blogPage * POSTS_PER_PAGE)

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold">Blog</h2>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Blog yazısı ara..."
                        className="rounded-2xl pl-9"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setBlogPage(1)
                        }}
                    />
                </div>
            </div>

            {/* Blog list */}
            <div className="space-y-3">
                {paginatedPosts.map((post) => (
                    <BlogPostCard key={post.title} {...post} />
                ))}

                {paginatedPosts.length === 0 && (
                    <div className="rounded-2xl border p-8 text-center text-muted-foreground">
                        Aramanızla eşleşen blog yazısı bulunamadı.
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                        disabled={blogPage === totalPages}
                        onClick={() => setBlogPage(blogPage + 1)}
                    >
                        Sonraki →
                    </Button>
                </div>
            )}
        </div>
    )
}
