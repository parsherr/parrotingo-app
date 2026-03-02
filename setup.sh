#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "🦜 Parrotingo Setup Script"
echo "========================="
echo ""

# ─── 1. PostgreSQL Kontrolü ───
echo -e "${YELLOW}[1/6]${NC} PostgreSQL kontrol ediliyor..."
if ! systemctl is-active --quiet postgresql 2>/dev/null; then
    echo -e "${RED}  ✗ PostgreSQL çalışmıyor!${NC}"
    echo "  Çalıştırmak için:"
    echo "    sudo systemctl start postgresql"
    echo "    sudo systemctl enable postgresql"
    exit 1
fi
echo -e "${GREEN}  ✓ PostgreSQL çalışıyor${NC}"

# ─── 2. pg_hba.conf — md5 auth ayarı ───
echo -e "${YELLOW}[2/6]${NC} pg_hba.conf kontrol ediliyor..."
PG_HBA="/var/lib/pgsql/data/pg_hba.conf"
if sudo grep -q "127.0.0.1/32.*ident" "$PG_HBA" 2>/dev/null; then
    echo "  → ident → md5 değiştiriliyor..."
    sudo sed -i 's/\(host.*127.0.0.1\/32\s*\)ident/\1md5/' "$PG_HBA"
    sudo sed -i 's/\(host.*::1\/128\s*\)ident/\1md5/' "$PG_HBA"
    sudo systemctl restart postgresql
    echo -e "${GREEN}  ✓ pg_hba.conf güncellendi ve PostgreSQL yeniden başlatıldı${NC}"
else
    echo -e "${GREEN}  ✓ pg_hba.conf zaten uygun${NC}"
fi

# ─── 3. Database & User oluştur ───
echo -e "${YELLOW}[3/6]${NC} Database ve user oluşturuluyor..."
sudo -u postgres psql -f "$SCRIPT_DIR/backend/scripts/init-db.sql"
echo -e "${GREEN}  ✓ Database hazır${NC}"

# ─── 4. Backend bağımlılıkları ───
echo -e "${YELLOW}[4/6]${NC} Backend bağımlılıkları kuruluyor..."
cd "$SCRIPT_DIR/backend"
pnpm install
echo -e "${GREEN}  ✓ Backend bağımlılıkları kuruldu${NC}"

# ─── 5. Prisma generate & push ───
echo -e "${YELLOW}[5/6]${NC} Prisma client ve schema ayarlanıyor..."
pnpm exec prisma generate
pnpm exec prisma db push
echo -e "${GREEN}  ✓ Database schema uygulandı${NC}"

# ─── 6. Frontend bağımlılıkları ───
echo -e "${YELLOW}[6/6]${NC} Frontend bağımlılıkları kontrol ediliyor..."
cd "$SCRIPT_DIR/frontend"
if [ ! -d "node_modules" ]; then
    pnpm install
fi
echo -e "${GREEN}  ✓ Frontend bağımlılıkları hazır${NC}"

echo ""
echo "========================="
echo -e "${GREEN}🎉 Kurulum tamamlandı!${NC}"
echo ""
echo "Uygulamayı başlatmak için 2 ayrı terminal aç:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd $SCRIPT_DIR/backend && pnpm dev"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd $SCRIPT_DIR/frontend && pnpm dev"
echo ""
echo "  Backend API:  http://localhost:4000/api"
echo "  Frontend:     http://localhost:3000"
echo "========================="
