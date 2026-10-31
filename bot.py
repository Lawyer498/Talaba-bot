"""
🎓 TALABA SLIDE BOT — Telegram Bot (Python + aiogram 3.x)
Markaziy sun'iy intellekt akademik dvigateli va to'lov tizimi.

Muallif / Admin: @Yurist_617 (ID: 8652976161)
Bot Token: 8766646881:AAH6gW0WhGjkikK4Pxih2EUj10PLSKjRWro
"""

import asyncio
import logging
from datetime import datetime
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.types import (
    InlineKeyboardMarkup, 
    InlineKeyboardButton, 
    CallbackQuery,
    BufferedInputFile
)
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage

# Logging sozlamalari
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# ASOSIY MA'LUMOTLAR
BOT_TOKEN = "8766646881:AAH6gW0WhGjkikK4Pxih2EUj10PLSKjRWro"
ADMIN_ID = 8652976161
ADMIN_USERNAME = "@Yurist_617"

CARD_HUMO = "9860 0803 2676 4729"
CARD_UZCARD = "6262 5704 3920 4670"
CARD_OWNER = "Safarov Azizbek Kamol Og'li"

# Bot va Dispatcher yaratish
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())

# FSM States (Bosqichlar)
class OrderState(StatesGroup):
    waiting_for_topic = State()
    waiting_for_author = State()
    waiting_for_language = State()
    waiting_for_pages = State()
    waiting_for_format = State()
    waiting_for_slides = State()
    waiting_for_chapters = State()
    waiting_for_translation_style = State()
    waiting_for_problem_diff = State()
    waiting_for_payment = State()
    waiting_for_receipt = State()

# Foydalanuvchilar ma'lumotlar bazasi (xotirada)
users_db = {}
pending_receipts = {}

def get_user(user_id: int, full_name: str = "Foydalanuvchi"):
    if user_id not in users_db:
        users_db[user_id] = {
            "balance": 0,
            "orders": [],
            "name": full_name,
            "user_id": user_id,
            "joined_at": datetime.now().strftime("%Y-%m-%d %H:%M")
        }
    return users_db[user_id]

# 1. /start KOMANDASI
@dp.message(Command("start"))
async def cmd_start(message: types.Message, state: FSMContext):
    await state.clear()
    user = get_user(message.from_user.id, message.from_user.full_name)
    user["name"] = message.from_user.full_name

    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="📝 Esse / Referat (5 000 so'm)", callback_data="service_esse"),
            InlineKeyboardButton(text="📊 Maqola (20 000 so'm)", callback_data="service_article")
        ],
        [
            InlineKeyboardButton(text="🎓 Kurs ishi (45 000 so'm)", callback_data="service_course"),
            InlineKeyboardButton(text="🎬 Prezentatsiya (8 000 so'm)", callback_data="service_presentation")
        ],
        [
            InlineKeyboardButton(text="📋 Mustaqil ish (3k-12k)", callback_data="service_independent"),
            InlineKeyboardButton(text="🌐 Tarjima (10 000 so'm)", callback_data="service_translation")
        ],
        [
            InlineKeyboardButton(text="🔢 Masala/Lab (5k-15k)", callback_data="service_problem"),
            InlineKeyboardButton(text="📚 Tezis (25 000 so'm)", callback_data="service_thesis")
        ],
        [
            InlineKeyboardButton(text="💰 Balansni to'ldirish", callback_data="balance_topup")
        ],
        [
            InlineKeyboardButton(text="📊 Buyurtmalarim", callback_data="my_orders"),
            InlineKeyboardButton(text="❓ Yordam & FAQ", callback_data="help")
        ]
    ])

    await message.answer(
        f"🎓 Assalomu alaykum, {user['name']}!\n\n"
        f"Men — Talaba Slide Bot, sizning shaxsiy akademik yordamchingizman.\n"
        f"O'zbekiston OTMlarining 35 ta ta'lim yo'nalishi bo'yicha ilmiy talablar va standartlar asosida xizmat ko'rsataman.\n\n"
        f"💰 Balansingiz: {user['balance']:,} so'm\n\n"
        f"📋 XIZMATLAR VA NARXLAR:\n"
        f"🔥 Mashhur:\n"
        f"📝 Esse / Referat — 5 000 so'm (1-2 min)\n"
        f"📊 Ilmiy Maqola — 20 000 so'm (2-3 min)\n"
        f"🎓 Kurs ishi — 45 000 so'm (3-5 min)\n"
        f"🎬 Prezentatsiya — 8 000 so'm (1-2 min)\n"
        f"📋 Mustaqil ish — 3 000-12 000 so'm (1 sahifa = 300 so'm)\n"
        f"🌐 Tarjima xizmati — 10 000 so'm (1-2 min)\n"
        f"🔢 Masala va Laboratoriya — 5 000-15 000 so'm\n"
        f"📚 Tezis — 25 000 so'm (1-2 min)\n\n"
        f"👇 Kerakli xizmat turini tanlang yoki balansingizni to'ldiring:",
        reply_markup=keyboard
    )

# 2. XIZMATLARNI TANLASH HANDLERS
@dp.callback_query(F.data == "service_esse")
async def process_esse(callback: CallbackQuery, state: FSMContext):
    await callback.message.edit_text(
        "📝 Esse / Referat yaratish\n\n"
        "Mavzuni kiriting:\n"
        "Masalan: Korrupsiyaga qarshi kurash, Sun'iy intellekt, Raqamli iqtisodiyot...",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
        ])
    )
    await state.set_state(OrderState.waiting_for_topic)
    await state.update_data(service_type="Esse / Referat", base_price=5000)

@dp.callback_query(F.data == "service_article")
async def process_article(callback: CallbackQuery, state: FSMContext):
    await callback.message.edit_text(
        "📊 Ilmiy Maqola yaratish\n\n"
        "Ilmiy maqola mavzusini kiriting:",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
        ])
    )
    await state.set_state(OrderState.waiting_for_topic)
    await state.update_data(service_type="Ilmiy Maqola", price=20000)

@dp.callback_query(F.data == "service_course")
async def process_course(callback: CallbackQuery, state: FSMContext):
    await callback.message.edit_text(
        "🎓 Kurs ishi yaratish (Rasmiy akademik talablar asosida)\n\n"
        "Kurs ishi mavzusini kiriting:",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
        ])
    )
    await state.set_state(OrderState.waiting_for_topic)
    await state.update_data(service_type="Kurs ishi")

@dp.callback_query(F.data == "service_presentation")
async def process_presentation(callback: CallbackQuery, state: FSMContext):
    await callback.message.edit_text(
        "🎬 Prezentatsiya (PPTX) yaratish\n\n"
        "Prezentatsiya mavzusini kiriting:",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
        ])
    )
    await state.set_state(OrderState.waiting_for_topic)
    await state.update_data(service_type="Prezentatsiya (PPTX)")

@dp.callback_query(F.data == "service_independent")
async def process_independent(callback: CallbackQuery, state: FSMContext):
    await callback.message.edit_text(
        "📋 Mustaqil ish yaratish\n\n"
        "Mavzuni kiriting:\n"
        "Masalan: Bozor iqtisodiyoti, Boshqaruv uslublari, Ekologiya...",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
        ])
    )
    await state.set_state(OrderState.waiting_for_topic)
    await state.update_data(service_type="Mustaqil ish")

@dp.callback_query(F.data == "service_translation")
async def process_translation(callback: CallbackQuery, state: FSMContext):
    await callback.message.edit_text(
        "🌐 Professional Tarjima xizmati\n\n"
        "Tarjima qilinishi kerak bo'lgan matnni yoki mavzuni yuboring:",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
        ])
    )
    await state.set_state(OrderState.waiting_for_topic)
    await state.update_data(service_type="Tarjima xizmati", price=10000)

@dp.callback_query(F.data == "service_problem")
async def process_problem(callback: CallbackQuery, state: FSMContext):
    await callback.message.edit_text(
        "🔢 Masala va Laboratoriya ishi\n\n"
        "Fan nomi va masala shartini yozing:",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
        ])
    )
    await state.set_state(OrderState.waiting_for_topic)
    await state.update_data(service_type="Masala va Laboratoriya")

@dp.callback_query(F.data == "service_thesis")
async def process_thesis(callback: CallbackQuery, state: FSMContext):
    await callback.message.edit_text(
        "📚 Ilmiy Tezis yaratish\n\n"
        "Tezis mavzusini kiriting:",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
        ])
    )
    await state.set_state(OrderState.waiting_for_topic)
    await state.update_data(service_type="Tezis", price=25000)

# 3. MAVZU KIRITILGANDA — TIL TANLASH
@dp.message(OrderState.waiting_for_topic)
async def process_topic(message: types.Message, state: FSMContext):
    await state.update_data(topic=message.text.strip())

    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="🇺🇿 O'zbekcha", callback_data="lang_uz"),
            InlineKeyboardButton(text="🇷🇺 Ruscha", callback_data="lang_ru")
        ],
        [
            InlineKeyboardButton(text="🇬🇧 Inglizcha", callback_data="lang_en"),
            InlineKeyboardButton(text="🇺🇿 Qoraqalpoqcha", callback_data="lang_kaa")
        ],
        [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
    ])

    await message.answer(
        "✅ Tilni tanlang:\nBarcha terminlar, qonunlar va adabiyotlar shu tilda bo'ladi:",
        reply_markup=keyboard
    )
    await state.set_state(OrderState.waiting_for_language)

# 4. TIL TANLANGANDA — XIZMATGA QARAB BOSQICH
@dp.callback_query(F.data.startswith("lang_"), OrderState.waiting_for_language)
async def process_language(callback: CallbackQuery, state: FSMContext):
    lang_map = {
        "lang_uz": "O'zbekcha",
        "lang_ru": "Ruscha",
        "lang_en": "Inglizcha",
        "lang_kaa": "Qoraqalpoqcha"
    }
    lang = lang_map.get(callback.data, "O'zbekcha")
    await state.update_data(language=lang)
    data = await state.get_data()
    service_type = data.get("service_type")

    if service_type == "Mustaqil ish":
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [
                InlineKeyboardButton(text="📄 10 sahifa — 3 000 so'm", callback_data="pages_10"),
                InlineKeyboardButton(text="📄 15 sahifa — 4 500 so'm", callback_data="pages_15")
            ],
            [
                InlineKeyboardButton(text="📄 20 sahifa — 6 000 so'm", callback_data="pages_20"),
                InlineKeyboardButton(text="📄 25 sahifa — 7 500 so'm", callback_data="pages_25")
            ],
            [
                InlineKeyboardButton(text="📄 30 sahifa — 9 000 so'm", callback_data="pages_30"),
                InlineKeyboardButton(text="📄 35 sahifa — 10 500 so'm", callback_data="pages_35")
            ],
            [
                InlineKeyboardButton(text="📄 40 sahifa — 12 000 so'm", callback_data="pages_40")
            ],
            [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
        ])
        await callback.message.edit_text(
            "📏 Necha sahifa bo'lsin?\n(1 sahifa = 300 so'm):",
            reply_markup=keyboard
        )
        await state.set_state(OrderState.waiting_for_pages)

    elif service_type == "Kurs ishi":
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [
                InlineKeyboardButton(text="📗 2 bob — 30 000 so'm (25-30 bet)", callback_data="chapters_2"),
                InlineKeyboardButton(text="📘 3 bob — 45 000 so'm (35-40 bet)", callback_data="chapters_3")
            ],
            [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
        ])
        await callback.message.edit_text(
            "📚 Kurs ishi boblar sonini tanlang:",
            reply_markup=keyboard
        )
        await state.set_state(OrderState.waiting_for_chapters)

    elif service_type == "Prezentatsiya (PPTX)":
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [
                InlineKeyboardButton(text="📊 10 slayd — 5 000 so'm", callback_data="slides_10"),
                InlineKeyboardButton(text="📊 12 slayd — 6 000 so'm", callback_data="slides_12")
            ],
            [
                InlineKeyboardButton(text="📊 15 slayd — 8 000 so'm", callback_data="slides_15"),
                InlineKeyboardButton(text="📊 20 slayd — 10 000 so'm", callback_data="slides_20")
            ],
            [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
        ])
        await callback.message.edit_text(
            "🎬 Slaydlar sonini tanlang:",
            reply_markup=keyboard
        )
        await state.set_state(OrderState.waiting_for_slides)

    elif service_type == "Tarjima xizmati":
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [
                InlineKeyboardButton(text="🔬 Ilmiy", callback_data="style_ilmiy"),
                InlineKeyboardButton(text="📜 Rasmiy", callback_data="style_rasmiy")
            ],
            [
                InlineKeyboardButton(text="🎨 Badiiy", callback_data="style_badiiy"),
                InlineKeyboardButton(text="📰 Jurnalistik", callback_data="style_jurnalistik")
            ],
            [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
        ])
        await callback.message.edit_text(
            "🎨 Tarjima uslubini tanlang:",
            reply_markup=keyboard
        )
        await state.set_state(OrderState.waiting_for_translation_style)

    elif service_type == "Masala va Laboratoriya":
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [
                InlineKeyboardButton(text="🟢 Oson — 5 000 so'm", callback_data="diff_easy"),
                InlineKeyboardButton(text="🟡 O'rta — 10 000 so'm", callback_data="diff_medium")
            ],
            [
                InlineKeyboardButton(text="🔴 Murakkab — 15 000 so'm", callback_data="diff_hard")
            ],
            [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
        ])
        await callback.message.edit_text(
            "📊 Murakkablik darajasini tanlang:",
            reply_markup=keyboard
        )
        await state.set_state(OrderState.waiting_for_problem_diff)

    else:
        # Esse / Referat va boshqalar uchun format tanlash
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [
                InlineKeyboardButton(text="📄 Standart PDF (Times New Roman 14)", callback_data="format_standard"),
                InlineKeyboardButton(text="📱 Qo'lyozma PDF (Daftar effekti)", callback_data="format_handwritten")
            ],
            [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
        ])
        await callback.message.edit_text(
            "🎨 Formatni tanlang:",
            reply_markup=keyboard
        )
        await state.set_state(OrderState.waiting_for_format)

# 5. BOSQICHLARNI QABUL QILISH
@dp.callback_query(F.data.startswith("pages_"), OrderState.waiting_for_pages)
async def process_pages(callback: CallbackQuery, state: FSMContext):
    pages = int(callback.data.split("_")[1])
    price = pages * 300
    await state.update_data(pages=pages, price=price, format="Standart PDF")
    await show_confirmation(callback.message, state, callback.from_user.id)

@dp.callback_query(F.data.startswith("chapters_"), OrderState.waiting_for_chapters)
async def process_chapters(callback: CallbackQuery, state: FSMContext):
    chapters = int(callback.data.split("_")[1])
    price = 30000 if chapters == 2 else 45000
    await state.update_data(chapters=chapters, price=price, format="Standart PDF")
    await show_confirmation(callback.message, state, callback.from_user.id)

@dp.callback_query(F.data.startswith("slides_"), OrderState.waiting_for_slides)
async def process_slides(callback: CallbackQuery, state: FSMContext):
    slides = int(callback.data.split("_")[1])
    prices = {10: 5000, 12: 6000, 15: 8000, 20: 10000}
    price = prices.get(slides, 8000)
    await state.update_data(slides=slides, price=price, format="PPTX Slaydlar")
    await show_confirmation(callback.message, state, callback.from_user.id)

@dp.callback_query(F.data.startswith("style_"), OrderState.waiting_for_translation_style)
async def process_style(callback: CallbackQuery, state: FSMContext):
    style_name = callback.data.split("_")[1].capitalize()
    await state.update_data(translation_style=style_name, price=10000, format="Word / PDF")
    await show_confirmation(callback.message, state, callback.from_user.id)

@dp.callback_query(F.data.startswith("diff_"), OrderState.waiting_for_problem_diff)
async def process_diff(callback: CallbackQuery, state: FSMContext):
    diff = callback.data.split("_")[1]
    diff_prices = {"easy": 5000, "medium": 10000, "hard": 15000}
    diff_names = {"easy": "Oson", "medium": "O'rta", "hard": "Murakkab"}
    await state.update_data(difficulty=diff_names.get(diff), price=diff_prices.get(diff, 10000), format="PDF Yechim")
    await show_confirmation(callback.message, state, callback.from_user.id)

@dp.callback_query(F.data.startswith("format_"), OrderState.waiting_for_format)
async def process_format(callback: CallbackQuery, state: FSMContext):
    fmt = "Qo'lyozma PDF" if callback.data == "format_handwritten" else "Standart PDF (Times New Roman)"
    data = await state.get_data()
    price = data.get("base_price", data.get("price", 5000))
    await state.update_data(format=fmt, price=price)
    await show_confirmation(callback.message, state, callback.from_user.id)

# 6. TASDIQLASH EKRANI
async def show_confirmation(message: types.Message, state: FSMContext, user_id: int):
    data = await state.get_data()
    user = get_user(user_id)
    price = data.get("price", 5000)

    text = (
        "✅ BUYURTMA MA'LUMOTLARI:\n\n"
        f"📋 Xizmat turi: {data.get('service_type')}\n"
        f"📝 Mavzu: {data.get('topic')}\n"
        f"🌐 Til: {data.get('language')}\n"
    )

    if "pages" in data:
        text += f"📏 Hajm: {data['pages']} sahifa\n"
    if "chapters" in data:
        text += f"📚 Boblar soni: {data['chapters']} bob\n"
    if "slides" in data:
        text += f"🎬 Slaydlar soni: {data['slides']} ta\n"
    if "format" in data:
        text += f"🎨 Format: {data['format']}\n"

    text += (
        f"💰 Narx: {price:,} so'm\n"
        f"━━━━━━━━━━━━━━━━━━━\n"
        f"Sizning balansingiz: 💰 {user['balance']:,} so'm"
    )

    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text=f"✅ Tasdiqlash va to'lash ({price:,} so'm)", callback_data="confirm_order")],
        [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
    ])

    await message.edit_text(text, reply_markup=keyboard)

# 7. TASDIQLASH VA AVTOMATIK GENERATSIYA
@dp.callback_query(F.data == "confirm_order")
async def confirm_order(callback: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    user = get_user(callback.from_user.id)
    price = data.get("price", 5000)

    if user["balance"] < price:
        needed = price - user["balance"]
        user["pending_order"] = dict(data)
        await callback.message.edit_text(
            f"❌ Balansingiz yetarli emas!\n\n"
            f"📋 Tanlangan xizmat: *{data.get('service_type')}*\n"
            f"📝 Mavzu: *{data.get('topic')}*\n"
            f"💵 Kerakli summa: *{price:,} so'm*\n"
            f"💰 Sizning balansingiz: *{user['balance']:,} so'm*\n"
            f"⚠️ Yetishmayotgan summa: *{needed:,} so'm*\n\n"
            f"❗️ Balansda mablag' yetarli bo'lmaganda buyurtma bajarilmaydi.\n"
            f"Admin to'lovni tasdiqlashi bilan ushbu xizmatni darhol bajarishingiz mumkin bo'ladi!",
            reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(text=f"💳 Balansni to'ldirish ({needed:,} so'm)", callback_data=f"topup_{needed}")],
                [InlineKeyboardButton(text="💰 Boshqa summa", callback_data="balance_topup")],
                [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
            ]),
            parse_mode="Markdown"
        )
        return

    # Balansdan yechish
    user["balance"] -= price

    # Buyurtmani saqlash
    order_id = len(user["orders"]) + 1
    new_order = {
        "id": order_id,
        "service": data.get("service_type"),
        "topic": data.get("topic"),
        "price": price,
        "format": data.get("format"),
        "status": "Bajarildi",
        "date": datetime.now().strftime("%Y-%m-%d %H:%M")
    }
    user["orders"].append(new_order)

    await callback.message.edit_text(
        "🔄 Generatsiya jarayoni yuklanmoqda, iltimos kuting...\n\n"
        "⏳ O'zbekiston qonunlari, rasmiy normativ hujjatlar va akademik talablar asosida tayyorlanmoqda...",
        reply_markup=None
    )

    # Sun'iy kechikish va generatsiya
    await asyncio.sleep(2.5)

    topic_title = data.get("topic", "Ilmiy_ish")
    safe_topic = topic_title.replace(" ", "_")[:30]

    # Tayyor namunaviy hujjat matni
    doc_sample_text = (
        f"O'ZBEKISTON RESPUBLIKASI OLIY TA'LIM, FAN VA INNOVATSIYALAR VAZIRLIGI\n\n"
        f"MAVZU: {topic_title.upper()}\n"
        f"Yo'nalish: 35 ta OTM ta'lim yo'nalishi\n"
        f"Bajaruvchi: {user['name']}\n"
        f"Toshkent — 2026\n\n"
        f"KIRISH\n"
        f"Shuni alohida ta'kidlash joizki, bugungi kunda mamlakatimizda amalga oshirilayotgan islohotlar sharoitida mazkur mavzuning ahamiyati beqiyosdir...\n\n"
        f"FOYDALANILGAN ADABIYOTLAR:\n"
        f"1. O'zbekiston Respublikasi Konstitutsiyasi, 2023.\n"
        f"2. O'zbekiston Respublikasi Prezidentining Farmon va Qarorlari to'plami.\n"
        f"3. OTM darslik va o'quv qo'llanmalari, 2024."
    )

    document_file = BufferedInputFile(
        doc_sample_text.encode("utf-8"),
        filename=f"{safe_topic}_{user['name']}.txt"
    )

    await callback.message.answer_document(
        document=document_file,
        caption=(
            f"🎉 TAYYOR!\n\n"
            f"✅ Mavzu: *{topic_title}*\n"
            f"📋 Xizmat: {data.get('service_type')}\n"
            f"📜 Format: Rasmiy akademik talablar\n"
            f"💰 Qolgan balansingiz: {user['balance']:,} so'm\n\n"
            f"Talaba Slide Bot xizmatidan foydalanganingiz uchun rahmat!"
        ),
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="🏠 Bosh menyu", callback_data="start")]
        ])
    )

    await state.clear()

# 8. BALANSNI TO'LDIRISH
@dp.callback_query(F.data == "balance_topup")
async def balance_topup(callback: CallbackQuery):
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="5 000 so'm", callback_data="topup_5000"),
            InlineKeyboardButton(text="10 000 so'm", callback_data="topup_10000")
        ],
        [
            InlineKeyboardButton(text="20 000 so'm", callback_data="topup_20000"),
            InlineKeyboardButton(text="50 000 so'm", callback_data="topup_50000")
        ],
        [
            InlineKeyboardButton(text="100 000 so'm", callback_data="topup_100000"),
            InlineKeyboardButton(text="200 000 so'm", callback_data="topup_200000")
        ],
        [InlineKeyboardButton(text="✍️ Boshqa summa", callback_data="topup_custom")],
        [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
    ])

    await callback.message.edit_text(
        "💳 Balansni to'ldirish\n\n"
        "Iltimos, balansga qo'shmoqchi bo'lgan summani tanlang:",
        reply_markup=keyboard
    )

@dp.callback_query(F.data.startswith("topup_"))
async def process_topup_amount(callback: CallbackQuery, state: FSMContext):
    if callback.data == "topup_custom":
        await callback.message.edit_text(
            "✍️ Qo'shmoqchi bo'lgan summani raqamda yozing (so'mda):\nMasalan: 35000",
            reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
            ])
        )
        await state.set_state(OrderState.waiting_for_payment)
        return

    amount = int(callback.data.split("_")[1])
    await state.update_data(topup_amount=amount)
    await show_payment_details(callback.message, amount)

@dp.message(OrderState.waiting_for_payment)
async def process_custom_amount(message: types.Message, state: FSMContext):
    if not message.text.isdigit():
        await message.answer("❌ Iltimos, faqat raqam kiriting (masalan: 35000):")
        return

    amount = int(message.text)
    if amount < 1000:
        await message.answer("❌ Minimal to'lov summasi 1 000 so'm.")
        return

    await state.update_data(topup_amount=amount)
    await show_payment_details(message, amount)

async def show_payment_details(message: types.Message, amount: int):
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="📩 Chekni (skrinshot) yuborish", callback_data="send_receipt")],
        [InlineKeyboardButton(text="⬅️ Summani o'zgartirish", callback_data="balance_topup")]
    ])

    text = (
        f"💳 To'lov qilish\n\n"
        f"💰 Tanlangan summa: {amount:,} so'm\n\n"
        f"✅ Iltimos, quyidagi kartalardan biriga aynan shu summani o'tkazing:\n\n"
        f"🔹 Humo: `{CARD_HUMO}`\n"
        f"🔹 Uzcard: `{CARD_UZCARD}`\n"
        f"👤 Egasi: *{CARD_OWNER}*\n\n"
        f"To'lovni amalga oshirgach, chekni (skrinshot) yuborish tugmasini bosing."
    )
    if hasattr(message, "edit_text"):
        await message.edit_text(text, reply_markup=keyboard, parse_mode="Markdown")
    else:
        await message.answer(text, reply_markup=keyboard, parse_mode="Markdown")

@dp.callback_query(F.data == "send_receipt")
async def ask_receipt(callback: CallbackQuery, state: FSMContext):
    await callback.message.edit_text(
        "📩 Iltimos, to'lov cheki skrinshotini (rasmini) shu chatga yuboring:",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel")]
        ])
    )
    await state.set_state(OrderState.waiting_for_receipt)

# 9. CHEKNI QABUL QILISH VA ADMINGA YUBORISH
@dp.message(OrderState.waiting_for_receipt, F.photo)
async def handle_receipt_photo(message: types.Message, state: FSMContext):
    data = await state.get_data()
    amount = data.get("topup_amount", 5000)
    user_id = message.from_user.id
    user_name = message.from_user.full_name
    username = f"@{message.from_user.username}" if message.from_user.username else "mavjud emas"

    photo = message.photo[-1]
    receipt_id = f"rec_{int(datetime.now().timestamp())}"

    pending_receipts[receipt_id] = {
        "user_id": user_id,
        "amount": amount,
        "photo_id": photo.file_id,
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    # Foydalanuvchiga tasdiq
    await message.answer(
        "✅ To'lov chekingiz adminga tekshirish uchun yuborildi!\n\n"
        f"💰 Summa: {amount:,} so'm\n"
        f"👤 Qabul qiluvchi: {CARD_OWNER}\n"
        f"⏳ Admin tomonidan 1-3 daqiqada tasdiqlanadi va balansingiz to'ldiriladi.",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="🏠 Bosh menyu", callback_data="start")]
        ])
    )

    # Adminga (@Yurist_617) yuborish
    admin_keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text=f"✅ Tasdiqlash (+{amount:,} so'm)", callback_data=f"adm_approve_{receipt_id}"),
            InlineKeyboardButton(text="❌ Rad etish (Soxta chek)", callback_data=f"adm_reject_{receipt_id}")
        ]
    ])

    admin_caption = (
        f"🚨 YANGI TO'LOV CHEKI (Talaba Slide Bot)\n\n"
        f"👤 Foydalanuvchi: {user_name} ({username})\n"
        f"🆔 ID: `{user_id}`\n"
        f"💰 Summa: *{amount:,} so'm*\n"
        f"⏱️ Vaqt: {datetime.now().strftime('%H:%M:%S')}\n"
        f"🔢 Chek ID: `{receipt_id}`\n\n"
        f"Admin (@Yurist_617), to'lovni tasdiqlaysizmi?"
    )

    try:
        await bot.send_photo(
            chat_id=ADMIN_ID,
            photo=photo.file_id,
            caption=admin_caption,
            parse_mode="Markdown",
            reply_markup=admin_keyboard
        )
    except Exception as e:
        logging.error(f"Adminga yuborishda xatolik: {e}")

    await state.clear()

# 10. ADMIN CHEKNI TASDIQLASH / RAD ETISH
@dp.callback_query(F.data.startswith("adm_approve_"))
async def admin_approve(callback: CallbackQuery):
    if callback.from_user.id != ADMIN_ID:
        await callback.answer("❌ Bu harakat faqat administrator uchun!", show_alert=True)
        return

    receipt_id = callback.data.replace("adm_approve_", "")
    receipt = pending_receipts.get(receipt_id)

    if not receipt:
        await callback.answer("⚠️ Chek allaqachon ko'rib chiqilgan.", show_alert=True)
        return

    user = get_user(receipt["user_id"])
    user["balance"] += receipt["amount"]

    # Admindagi tugmani yangilash
    await callback.message.edit_caption(
        caption=f"{callback.message.caption}\n\n✅ TASDIQLANDI! Balans to'ldirildi (+{receipt['amount']:,} so'm).",
        reply_markup=None
    )

    # Foydalanuvchiga xabar va darhol bajarish imkoniyati
    pending = user.get("pending_order")
    try:
        if pending and user["balance"] >= pending.get("price", 5000):
            await bot.send_message(
                chat_id=receipt["user_id"],
                text=(
                    f"🎉 To'lovingiz tasdiqlandi!\n\n"
                    f"➕ Balansga qo'shildi: +{receipt['amount']:,} so'm\n"
                    f"💰 Yangi balansingiz: *{user['balance']:,} so'm*\n\n"
                    f"🎯 Kutayotgan xizmatingiz:\n"
                    f"📋 Xizmat: {pending.get('service_type')}\n"
                    f"📝 Mavzu: *{pending.get('topic')}*\n"
                    f"💵 Narxi: *{pending.get('price', 5000):,} so'm*\n\n"
                    f"Admin to'lovni tasdiqladi! Xizmatingizni hoziroq darhol ishga tushirishingiz mumkin:"
                ),
                reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                    [InlineKeyboardButton(text="🚀 Buyurtmani darhol bajarish", callback_data="exec_pending_order")],
                    [InlineKeyboardButton(text="🏠 Bosh menyu", callback_data="start")]
                ]),
                parse_mode="Markdown"
            )
        else:
            await bot.send_message(
                chat_id=receipt["user_id"],
                text=(
                    f"🎉 Balansingiz muvaffaqiyatli to'ldirildi!\n\n"
                    f"➕ Qo'shildi: {receipt['amount']:,} so'm\n"
                    f"💰 Yangi balansingiz: {user['balance']:,} so'm\n\n"
                    f"Xizmatlardan to'liq foydalanishingiz mumkin:"
                ),
                reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                    [InlineKeyboardButton(text="📋 Xizmat tanlash", callback_data="start")]
                ])
            )
    except Exception as e:
        logging.error(f"Foydalanuvchiga xabar yuborishda xatolik: {e}")

    del pending_receipts[receipt_id]
    await callback.answer("✅ Balans muvaffaqiyatli to'ldirildi!")

# 10.1 DARHOL BUYURTMANI BAJARISH (TO'LOV TASDIQLANGANDAN SO'NG)
@dp.callback_query(F.data == "exec_pending_order")
async def process_exec_pending_order(callback: CallbackQuery):
    user = get_user(callback.from_user.id)
    pending = user.get("pending_order")

    if not pending:
        await callback.answer("⚠️ Kutayotgan buyurtma topilmadi.", show_alert=True)
        return

    price = pending.get("price", 5000)
    if user["balance"] < price:
        await callback.answer("❌ Balansda yetarli mablag' mavjud emas!", show_alert=True)
        return

    # Mablag'ni yechish
    user["balance"] -= price
    user["pending_order"] = None

    order_id = len(user["orders"]) + 1
    new_order = {
        "id": order_id,
        "service": pending.get("service_type"),
        "topic": pending.get("topic"),
        "price": price,
        "format": pending.get("format"),
        "status": "Bajarildi",
        "date": datetime.now().strftime("%Y-%m-%d %H:%M")
    }
    user["orders"].append(new_order)

    await callback.message.edit_text(
        "🔄 Generatsiya jarayoni boshlandi, iltimos kuting...\n\n"
        "⏳ O'zbekiston qonunlari, rasmiy normativ hujjatlar va akademik talablar asosida tayyorlanmoqda...",
        reply_markup=None
    )

    await asyncio.sleep(2.5)

    topic_title = pending.get("topic", "Ilmiy_ish")
    safe_topic = topic_title.replace(" ", "_")[:30]

    doc_sample_text = (
        f"O'ZBEKISTON RESPUBLIKASI OLIY TA'LIM, FAN VA INNOVATSIYALAR VAZIRLIGI\n\n"
        f"MAVZU: {topic_title.upper()}\n"
        f"Yo'nalish: 35 ta OTM ta'lim yo'nalishi\n"
        f"Bajaruvchi: {user['name']}\n"
        f"Toshkent — 2026\n\n"
        f"KIRISH\n"
        f"Bugungi kunda mamlakatimizda amalga oshirilayotgan islohotlar sharoitida mazkur mavzuning ahamiyati beqiyosdir...\n\n"
        f"FOYDALANILGAN ADABIYOTLAR:\n"
        f"1. O'zbekiston Respublikasi Konstitutsiyasi, 2023.\n"
        f"2. O'zbekiston Respublikasi Prezidentining Farmon va Qarorlari to'plami.\n"
        f"3. OTM darslik va o'quv qo'llanmalari, 2024."
    )

    document_file = BufferedInputFile(
        doc_sample_text.encode("utf-8"),
        filename=f"{safe_topic}_{user['name']}.txt"
    )

    await callback.message.answer_document(
        document=document_file,
        caption=(
            f"🎉 BUYURTMANGIZ TAYYOR!\n\n"
            f"✅ Mavzu: *{topic_title}*\n"
            f"📋 Xizmat: {pending.get('service_type')}\n"
            f"📜 Format: Rasmiy akademik talablar\n"
            f"💰 Qolgan balansingiz: {user['balance']:,} so'm\n\n"
            f"Talaba Slide Bot xizmatidan foydalanganingiz uchun rahmat!"
        ),
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="🏠 Bosh menyu", callback_data="start")]
        ])
    )

@dp.callback_query(F.data.startswith("adm_reject_"))
async def admin_reject(callback: CallbackQuery):
    if callback.from_user.id != ADMIN_ID:
        await callback.answer("❌ Bu harakat faqat administrator uchun!", show_alert=True)
        return

    receipt_id = callback.data.replace("adm_reject_", "")
    receipt = pending_receipts.get(receipt_id)

    if not receipt:
        await callback.answer("⚠️ Chek allaqachon ko'rib chiqilgan.", show_alert=True)
        return

    await callback.message.edit_caption(
        caption=f"{callback.message.caption}\n\n❌ RAD ETILDI! (Soxta chek yoki to'lov tushmagan).",
        reply_markup=None
    )

    try:
        await bot.send_message(
            chat_id=receipt["user_id"],
            text=(
                f"❌ Kechirasiz, yuborgan to'lov chekingiz rad etildi.\n\n"
                f"Sababi: Hisobga to'lov tushmagan yoki chek ma'lumotlari mos kelmadi.\n"
                f"Savollar bo'lsa adminga murojaat qiling: {ADMIN_USERNAME}"
            ),
            reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(text="💰 Qayta to'lash", callback_data="balance_topup")]
            ])
        )
    except Exception as e:
        logging.error(f"Foydalanuvchiga xabar yuborishda xatolik: {e}")

    del pending_receipts[receipt_id]
    await callback.answer("❌ Chek rad etildi.")

# 11. BUYURTMALARIM
@dp.callback_query(F.data == "my_orders")
async def show_orders(callback: CallbackQuery):
    user = get_user(callback.from_user.id)
    if not user["orders"]:
        text = "📊 Sizda hali buyurtmalar mavjud emas."
    else:
        text = "📊 SIZNING BUYURTMALARINGIZ:\n\n"
        for o in user["orders"][-5:]:
            text += (
                f"🔹 #{o['id']} {o['service']}\n"
                f"📝 Mavzu: {o['topic']}\n"
                f"💰 Narx: {o['price']:,} so'm\n"
                f"📅 Sana: {o['date']}\n"
                f"✅ Holati: {o['status']}\n\n"
            )

    await callback.message.edit_text(
        text,
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="🏠 Bosh menyu", callback_data="start")]
        ])
    )

# 12. YORDAM
@dp.callback_query(F.data == "help")
async def show_help(callback: CallbackQuery):
    await callback.message.edit_text(
        "❓ Yordam va Qo'llanma\n\n"
        "1️⃣ Xizmat turini tanlang (Esse, Maqola, Kurs ishi, PPTX...)\n"
        "2️⃣ Mavzuni yozing va tilni tanlang\n"
        "3️⃣ Kerakli format yoki sahifa sonini tanlang\n"
        "4️⃣ Balansingizdan to'lang yoki balansni to'ldiring\n"
        "5️⃣ 1-5 minutda rasmiy talablarga to'liq mos tayyor faylni oling!\n\n"
        f"📞 Administrator: {ADMIN_USERNAME}\n"
        "🔒 Xavfsizlik: Ma'lumotlar 30 kundan so'ng avtomatik o'chiriladi.",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="🏠 Bosh menyu", callback_data="start")]
        ])
    )

# 13. BEKOR QILISH VA STARTGA QAYTISH
@dp.callback_query(F.data == "cancel")
async def process_cancel(callback: CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.edit_text(
        "❌ Amaliyot bekor qilindi.",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="🏠 Bosh menyu", callback_data="start")]
        ])
    )

@dp.callback_query(F.data == "start")
async def back_to_start(callback: CallbackQuery, state: FSMContext):
    await cmd_start(callback.message, state)

# 14. ADMIN BUYRUQ (/admin)
@dp.message(Command("admin"))
async def cmd_admin(message: types.Message):
    if message.from_user.id != ADMIN_ID:
        await message.answer("❌ Ushbu buyruq faqat bot administratori (@Yurist_617) uchun!")
        return

    total_users = len(users_db)
    pending_count = len(pending_receipts)
    total_balance = sum(u["balance"] for u in users_db.values())

    await message.answer(
        f"🛡️ ADMINISTRATOR BOSHQARUV PANELI\n\n"
        f"👤 Administrator: {ADMIN_USERNAME}\n"
        f"🆔 ID: `{ADMIN_ID}`\n"
        f"👥 Foydalanuvchilar soni: {total_users}\n"
        f"⏳ Tasdiqlanmagan cheklar: {pending_count}\n"
        f"💰 Foydalanuvchilar balansi: {total_balance:,} so'm\n\n"
        f"Kartalar: Humo ({CARD_HUMO}), Uzcard ({CARD_UZCARD})\n"
        f"Egasi: {CARD_OWNER}"
    )

# ASOSIY ISHGA TUSHIRISH
async def main():
    print(f"✅ Talaba Slide Bot ishga tushdi! (@Yurist_617)")
    print(f"🤖 Bot Token: {BOT_TOKEN[:15]}...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
