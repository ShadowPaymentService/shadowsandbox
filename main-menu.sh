#!/bin/bash

# =========================
# COLORS
# =========================
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

USER_FILE="users.db"

# =========================
# TYPEWRITER EFFECT
# =========================
type_text() {
  text="$1"
  delay=0.015
  for ((i=0; i<${#text}; i++)); do
    echo -ne "${text:$i:1}"
    sleep $delay
  done
  echo ""
}

# =========================
# PROGRESS BAR
# =========================
progress_bar() {
  echo -ne "${YELLOW}["
  for i in {1..20}; do
    echo -ne "#"
    sleep 0.05
  done
  echo -e "] 100%${NC}"
}

# =========================
# HASH PASSWORD
# =========================
hash_pass() {
  echo -n "$1" | sha256sum | awk '{print $1}'
}

# =========================
# STEP 1 BANNER
# =========================
clear
echo -e "${CYAN}"
echo "███████╗██╗  ██╗ █████╗ ██████╗  ██████╗ ███████╗ █████╗ ███╗   ██╗██████╗ "
echo "██╔════╝██║  ██║██╔══██╗██╔══██╗██╔═══██╗██╔════╝██╔══██╗████╗  ██║██╔══██╗"
echo "███████╗███████║███████║██████╔╝██║   ██║█████╗  ███████║██╔██╗ ██║██║  ██║"
echo "╚════██║██╔══██║██╔══██║██╔══██╗██║   ██║██╔══╝  ██╔══██║██║╚██╗██║██║  ██║"
echo "███████║██║  ██║██║  ██║██║  ██║╚██████╔╝███████╗██║  ██║██║ ╚████║██████╔╝"
echo "╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ "
echo -e "${NC}"

type_text ">>> SHADOWSANDBOX PANEL <<<"
type_text "{CREATE ACCOUNT OR LOGIN YOUR ACCOUNT FOR INSTALL WEBSITE LIKE CODESANDBOX}"
echo ""

# =========================
# REGISTER
# =========================
register() {
  echo ""
  type_text "[+] Create Account"
  read -p "Username: " user
  read -s -p "Password: " pass
  echo ""

  hashed=$(hash_pass "$pass")
  echo "$user:$hashed" >> $USER_FILE

  echo -e "${GREEN}[✔] Account Created${NC}"
}

# =========================
# LOGIN
# =========================
login() {
  echo ""
  type_text "[+] Login"
  read -p "Username: " user
  read -s -p "Password: " pass
  echo ""

  hashed=$(hash_pass "$pass")

  if grep -q "$user:$hashed" $USER_FILE 2>/dev/null; then
    echo -e "${GREEN}[✔] Login Success${NC}"
    return 0
  else
    echo -e "${RED}[✖] Wrong Credentials${NC}"
    return 1
  fi
}

# =========================
# AUTH MENU
# =========================
type_text "1) Register"
type_text "2) Login"
echo ""

read -p "Select: " auth

if [ "$auth" == "1" ]; then
  register
fi

login || exit

# =========================
# STEP 2 BANNER (CONTROL PANEL)
# =========================
clear
echo -e "${GREEN}"
echo "███████╗██╗  ██╗ █████╗ ██████╗  ██████╗ ███████╗ █████╗ ███╗   ██╗██████╗ "
echo "██╔════╝██║  ██║██╔══██╗██╔══██╗██╔═══██╗██╔════╝██╔══██╗████╗  ██║██╔══██╗"
echo "███████╗███████║███████║██████╔╝██║   ██║█████╗  ███████║██╔██╗ ██║██║  ██║"
echo "╚════██║██╔══██║██╔══██║██╔══██╗██║   ██║██╔══╝  ██╔══██║██║╚██╗██║██║  ██║"
echo "███████║██║  ██║██║  ██║██║  ██║╚██████╔╝███████╗██║  ██║██║ ╚████║██████╔╝"
echo "╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ "
echo -e "${NC}"

type_text ">>> ShadowSandBox Control Center Own By <<< ShadowCraftMC >>>"
sleep 0.5

# =========================
# MAIN MENU
# =========================
while true; do
  echo ""
  type_text "1) Website v1 (Auto Install)"
  type_text "2) Cloudflare Setup"
  type_text "3) Exit"
  echo ""

  read -p "Choose option: " option

  if [ "$option" == "1" ]; then

    read -p "Enter domain (example.com): " domain

    type_text "[*] Updating system..."
    progress_bar
    apt update -y > /dev/null 2>&1

    type_text "[*] Installing packages..."
    progress_bar
    apt install -y curl git > /dev/null 2>&1

    type_text "[*] Installing NodeJS..."
    progress_bar
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - > /dev/null 2>&1
    apt install -y nodejs > /dev/null 2>&1

    type_text "[*] Cloning project..."
    progress_bar
    git clone https://github.com/ShadowPaymentService/shadowsandbox.git
    cd shadowsandbox

    type_text "[*] Installing dependencies..."
    progress_bar
    npm install > /dev/null 2>&1

    type_text "[*] Starting server..."
    progress_bar
    npm install -g pm2 > /dev/null 2>&1
    pm2 start "npm run dev" --name shadowsandbox > /dev/null 2>&1
    pm2 save > /dev/null 2>&1

    echo ""
    echo -e "${GREEN}[✔] WEBSITE INSTALLED${NC}"
    echo -e "${CYAN}Open: http://$domain:3000${NC}"

  elif [ "$option" == "2" ]; then

    clear
    type_text ">>> CLOUDFLARE SETUP <<<"
    echo ""
    type_text "1) dash.cloudflare.com"
    type_text "2) Add site"
    type_text "3) Set nameservers"
    type_text "4) Add DNS A -> VPS IP"
    echo ""
    echo -e "${GREEN}[✔] Done${NC}"

  elif [ "$option" == "3" ]; then
    echo "Bye 😎 | Thanks For Using Our Tools🔥"
    exit
  fi

done
