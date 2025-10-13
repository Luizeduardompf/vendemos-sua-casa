#!/bin/bash

echo "🔧 CORRIGINDO CHAVE DO SUPABASE"
echo "================================"
echo ""
echo "1. Acesse: https://supabase.com/dashboard/project/xbsrabobcleosovskqaf/settings/api"
echo "2. Copie a 'anon public' key"
echo "3. Cole abaixo e pressione Enter:"
echo ""

read -p "Cole a chave aqui: " SUPABASE_KEY

if [ -n "$SUPABASE_KEY" ]; then
    echo "🔧 Atualizando .env.local..."
    sed -i '' "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_KEY|" .env.local
    echo "✅ Chave atualizada com sucesso!"
    echo ""
    echo "🧪 Testando conexão..."
    node test-supabase.js
    echo ""
    echo "🔄 Reiniciando servidor..."
    pkill -f "next dev" 2>/dev/null
    sleep 2
    npm run dev &
    echo "✅ Servidor reiniciado!"
    echo ""
    echo "🧪 Teste o login em: http://localhost:3000/auth/login"
else
    echo "❌ Nenhuma chave fornecida. Execute o script novamente."
fi
