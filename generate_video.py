import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio

OUTPUT_PATH = os.path.abspath('stockpilot-mern/client/public/stockpilot_demo.mp4')
WIDTH = 1280
HEIGHT = 720
FPS = 24
TOTAL_SCENES = 8
FRAMES_PER_SCENE = 110  # ~4.6 seconds per scene, total ~37 seconds
TOTAL_FRAMES = TOTAL_SCENES * FRAMES_PER_SCENE

# Design Tokens (Option 1 Palette)
BG_IVORY = (250, 247, 240)
BG_CREAM = (244, 235, 221)
WHITE = (255, 255, 255)
FOREST_PRIMARY = (20, 92, 56)
FOREST_DEEP = (16, 69, 44)
FOREST_LIGHT = (234, 247, 238)
ORANGE_ACCENT = (242, 154, 56)
ORANGE_LIGHT = (254, 246, 234)
TEXT_PRIMARY = (24, 37, 28)
TEXT_SECONDARY = (104, 115, 105)
TEXT_MUTED = (142, 153, 143)
BORDER_COLOR = (232, 226, 215)
RED_ACCENT = (185, 56, 38)
RED_LIGHT = (253, 240, 238)

# Load fonts
FONT_DIR = 'C:/Windows/Fonts/'
def get_font(name, size):
    try:
        return ImageFont.truetype(os.path.join(FONT_DIR, name), size)
    except:
        return ImageFont.load_default()

font_serif_huge = get_font('georgiab.ttf', 44)
font_serif_large = get_font('georgiab.ttf', 32)
font_serif_med = get_font('georgiab.ttf', 24)
font_serif_small = get_font('georgiab.ttf', 18)

font_sans_bold = get_font('segoeuib.ttf', 20)
font_sans_med = get_font('segoeui.ttf', 16)
font_sans_small = get_font('segoeui.ttf', 13)
font_mono_bold = get_font('arialbd.ttf', 22)
font_mono_small = get_font('arialbd.ttf', 14)

def draw_logo(draw, x, y, size=30):
    # Mountain peak + orange curve + green airplane
    draw.polygon([(x, y+24), (x+16, y+4), (x+24, y+16), (x+32, y+8), (x+40, y+24)], fill=FOREST_PRIMARY)
    draw.line([(x, y+24), (x+16, y+4), (x+24, y+16), (x+32, y+8), (x+40, y+24)], fill=FOREST_DEEP, width=3)
    draw.arc([x-2, y+16, x+44, y+30], 0, 180, fill=ORANGE_ACCENT, width=4)
    # Airplane
    draw.polygon([(x+34, y+4), (x+42, y), (x+38, y+8), (x+42, y+6)], fill=FOREST_PRIMARY)

def draw_topbar(draw, scene_num, scene_title):
    # White navbar background
    draw.rectangle([0, 0, WIDTH, 60], fill=WHITE, outline=BORDER_COLOR)
    draw_logo(draw, 28, 16, 28)
    draw.text((80, 18), "StockPilot AI", font=font_serif_med, fill=TEXT_PRIMARY)
    
    # Scene Indicator Pill
    pill_text = f"SCENE {scene_num}/8 · {scene_title.upper()}"
    draw.rounded_rectangle([WIDTH - 380, 14, WIDTH - 28, 46], radius=16, fill=FOREST_LIGHT, outline=FOREST_PRIMARY)
    draw.text((WIDTH - 365, 20), pill_text, font=font_mono_small, fill=FOREST_PRIMARY)

def draw_progress_bar(draw, frame_idx):
    progress = frame_idx / TOTAL_FRAMES
    bar_width = int(WIDTH * progress)
    draw.rectangle([0, HEIGHT - 6, WIDTH, HEIGHT], fill=BORDER_COLOR)
    draw.rectangle([0, HEIGHT - 6, bar_width, HEIGHT], fill=FOREST_PRIMARY)

def render_scene_1(frame_in_scene):
    # SCENE 1: Introduction
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_IVORY)
    draw = ImageDraw.Draw(img)
    draw_topbar(draw, 1, "Product Overview")
    
    # Animated subtle float
    t = frame_in_scene / FRAMES_PER_SCENE
    offset_y = int(math.sin(t * math.pi * 2) * 5)
    
    # Pill badge
    draw.rounded_rectangle([WIDTH//2 - 160, 110 + offset_y, WIDTH//2 + 160, 144 + offset_y], radius=17, fill=BG_CREAM, outline=BORDER_COLOR)
    draw.text((WIDTH//2 - 135, 118 + offset_y), "✦ AI-POWERED TRAVEL PROCUREMENT", font=font_mono_small, fill=FOREST_PRIMARY)
    
    # Large Logo in Center
    draw_logo(draw, WIDTH//2 - 140, 175 + offset_y, 50)
    draw.text((WIDTH//2 - 80, 165 + offset_y), "StockPilot AI", font=font_serif_huge, fill=TEXT_PRIMARY)
    
    # Tagline
    tagline_1 = "Smarter Travel Inventory Buying for"
    draw.text((WIDTH//2 - 290, 245 + offset_y), tagline_1, font=font_serif_large, fill=TEXT_PRIMARY)
    draw.text((WIDTH//2 + 185, 245 + offset_y), "Higher Profits", font=font_serif_large, fill=FOREST_PRIMARY)
    draw.arc([WIDTH//2 + 185, 280 + offset_y, WIDTH//2 + 360, 292 + offset_y], 0, 180, fill=ORANGE_ACCENT, width=4)
    
    # Subtitle
    sub = "Autonomous multi-horizon demand forecasting, Newsvendor risk modeling, and capital budget allocation."
    draw.text((WIDTH//2 - 380, 310 + offset_y), sub, font=font_sans_med, fill=TEXT_SECONDARY)
    
    # 3 Value Pillars Cards
    pillars = [
        ("104-Week Seasonal Forecast", "Extracts secular growth, holiday cycles & sold-out censored capacity."),
        ("Newsvendor Economic Model", "Solves critical service ratio balancing underage margin vs overage loss."),
        ("Greedy Knapsack Allocator", "Maximizes risk-adjusted profit per rupee across hotels, flights & villas.")
    ]
    card_w = 340
    start_x = (WIDTH - (3 * card_w + 2 * 30)) // 2
    for i, (title, desc) in enumerate(pillars):
        cx = start_x + i * (card_w + 30)
        cy = 400 + offset_y
        draw.rounded_rectangle([cx, cy, cx + card_w, cy + 180], radius=16, fill=WHITE, outline=BORDER_COLOR)
        draw.rounded_rectangle([cx + 20, cy + 20, cx + 56, cy + 56], radius=10, fill=FOREST_LIGHT)
        draw.text((cx + 28, cy + 26), f"0{i+1}", font=font_mono_small, fill=FOREST_PRIMARY)
        draw.text((cx + 20, cy + 72), title, font=font_serif_small, fill=TEXT_PRIMARY)
        # Wrap desc
        words = desc.split()
        line1 = " ".join(words[:6])
        line2 = " ".join(words[6:])
        draw.text((cx + 20, cy + 104), line1, font=font_sans_small, fill=TEXT_SECONDARY)
        draw.text((cx + 20, cy + 126), line2, font=font_sans_small, fill=TEXT_SECONDARY)
    
    return img

def render_scene_2(frame_in_scene):
    # SCENE 2: Executive Dashboard
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_IVORY)
    draw = ImageDraw.Draw(img)
    draw_topbar(draw, 2, "Executive Dashboard & KPIs")
    
    # Title
    draw.text((40, 75), "Autonomous Travel Procurement Dashboard", font=font_serif_med, fill=TEXT_PRIMARY)
    draw.text((40, 108), "Real-time capital deployment, predictive demand baseline & portfolio health", font=font_sans_small, fill=TEXT_SECONDARY)
    
    # The 5 Core KPIs (Requested strictly by User!)
    kpis = [
        ("TOTAL BUDGET", "₹10.00 Cr", "Capital ceiling", FOREST_PRIMARY),
        ("BUDGET UTILIZED", "₹9.98 Cr", "99.8% deployed", FOREST_PRIMARY),
        ("PROJECTED PROFIT", "₹2.14 Cr", "+21.4% ROI", FOREST_PRIMARY),
        ("EXPECTED DEMAND", "5,420 Units", "P50 booked units", ORANGE_ACCENT),
        ("ACTIVE OPPORTUNITIES", "8 Assets", "Hotels, flights & villas", FOREST_DEEP)
    ]
    kw = 224
    kx_start = 40
    for i, (k_title, k_val, k_sub, col) in enumerate(kpis):
        x = kx_start + i * (kw + 16)
        y = 140
        draw.rounded_rectangle([x, y, x + kw, y + 100], radius=14, fill=WHITE, outline=BORDER_COLOR)
        draw.text((x + 16, y + 14), k_title, font=font_mono_small, fill=TEXT_MUTED)
        draw.text((x + 16, y + 38), k_val, font=font_mono_bold, fill=col)
        draw.text((x + 16, y + 72), k_sub, font=font_sans_small, fill=TEXT_SECONDARY)
        
    # Main Chart Box (Left)
    draw.rounded_rectangle([40, 260, 840, 640], radius=16, fill=WHITE, outline=BORDER_COLOR)
    draw.text((64, 280), "Goa Beachfront Resort · Demand Forecast Curve (P10/P50/P90)", font=font_serif_small, fill=TEXT_PRIMARY)
    draw.text((64, 306), "26-week backtested baseline with forward 12-week confidence tunnel", font=font_sans_small, fill=TEXT_SECONDARY)
    
    # Chart Grid & Simulated Curve
    base_y = 580
    top_y = 360
    draw.line([90, base_y, 800, base_y], fill=BORDER_COLOR, width=1)
    draw.line([90, (base_y + top_y)//2, 800, (base_y + top_y)//2], fill=BORDER_COLOR, width=1)
    
    # Draw Historical Line
    hist_pts = []
    for idx, week in enumerate(range(20)):
        cx = 100 + idx * 22
        cy = base_y - int(100 + math.sin(idx * 0.4) * 60 + idx * 3)
        hist_pts.append((cx, cy))
    for idx in range(len(hist_pts)-1):
        draw.line([hist_pts[idx], hist_pts[idx+1]], fill=TEXT_SECONDARY, width=3)
    
    # Today Marker
    tx = hist_pts[-1][0]
    draw.line([tx, 350, tx, base_y], fill=FOREST_PRIMARY, width=2)
    draw.rounded_rectangle([tx - 25, 335, tx + 25, 355], radius=6, fill=BG_CREAM, outline=FOREST_PRIMARY)
    draw.text((tx - 18, 339), "TODAY", font=font_mono_small, fill=FOREST_PRIMARY)
    
    # Forecast Band and P50
    fc_pts = []
    for idx, week in enumerate(range(12)):
        cx = tx + (idx + 1) * 26
        cy = hist_pts[-1][1] - int(idx * 6 + math.sin(idx * 0.5) * 30)
        fc_pts.append((cx, cy))
    # Dashed Forecast Line
    for idx in range(len(fc_pts)-1):
        draw.line([fc_pts[idx], fc_pts[idx+1]], fill=FOREST_PRIMARY, width=3)
    
    # Right Box: Allocation Donut summary
    draw.rounded_rectangle([860, 260, 1240, 640], radius=16, fill=WHITE, outline=BORDER_COLOR)
    draw.text((884, 280), "Capital Allocation Breakdown", font=font_serif_small, fill=TEXT_PRIMARY)
    draw.text((884, 306), "Deployed budget by destination", font=font_sans_small, fill=TEXT_SECONDARY)
    
    dest_allocs = [
        ("Dubai Flight Charters", "₹2.52 Cr (25.2%)", FOREST_PRIMARY),
        ("Goa Beachfront Hotels", "₹1.88 Cr (18.8%)", ORANGE_ACCENT),
        ("Bali Ocean Suites", "₹1.45 Cr (14.5%)", FOREST_DEEP),
        ("Bangkok Flight Seats", "₹1.32 Cr (13.2%)", (54, 122, 77)),
        ("Jaipur Palace Hotels", "₹1.15 Cr (11.5%)", (192, 113, 25)),
        ("Kerala Retreat Stays", "₹0.98 Cr (9.8%)", TEXT_MUTED),
    ]
    for idx, (dname, dval, col) in enumerate(dest_allocs):
        ay = 360 + idx * 42
        draw.rectangle([884, ay + 4, 896, ay + 16], fill=col)
        draw.text((908, ay), dname, font=font_sans_med, fill=TEXT_PRIMARY)
        draw.text((1090, ay), dval, font=font_mono_small, fill=col)

    return img

def render_scene_3(frame_in_scene):
    # SCENE 3: Inventory Management
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_IVORY)
    draw = ImageDraw.Draw(img)
    draw_topbar(draw, 3, "Travel Inventory Management")
    
    draw.text((40, 75), "Travel Inventory Catalog & Opportunity Matrix", font=font_serif_med, fill=TEXT_PRIMARY)
    draw.text((40, 108), "Manage hotel rooms, flight seat blocks, villas, and travel packages across suppliers", font=font_sans_small, fill=TEXT_SECONDARY)
    
    # Table Card
    draw.rounded_rectangle([40, 140, WIDTH - 40, 640], radius=16, fill=WHITE, outline=BORDER_COLOR)
    
    # Table Headers
    draw.rectangle([40, 140, WIDTH - 40, 190], fill=BG_CREAM)
    headers = [
        ("ASSET NAME", 60),
        ("CATEGORY", 320),
        ("SUPPLIER", 460),
        ("UNIT COST", 680),
        ("SELLING PRICE", 800),
        ("UNIT MARGIN", 930),
        ("SUPPLIER CAP", 1080)
    ]
    for h_name, hx in headers:
        draw.text((hx, 155), h_name, font=font_mono_small, fill=TEXT_MUTED)
        
    rows = [
        ("Goa Beachfront Resort", "Hotel Rooms", "Royal Palms Hospitality", "₹3,200", "₹4,400", "+₹1,200 (38%)", "14,000 units"),
        ("Dubai Gulf Aviation Charters", "Flight Seats", "Gulf Aviation Charters", "₹14,000", "₹16,800", "+₹2,800 (20%)", "22,000 seats"),
        ("Bali Ocean Pool Suites", "Resorts", "Nirvana Island Resorts", "₹6,200", "₹8,600", "+₹2,400 (39%)", "8,000 units"),
        ("Maldives Overwater Bungalows", "Villas", "Atoll Marine Villas", "₹21,000", "₹30,000", "+₹9,000 (43%)", "2,600 units"),
        ("Singapore Central Suites", "Hotel Rooms", "Merlion City Hotels", "₹5,200", "₹6,900", "+₹1,700 (33%)", "11,000 units"),
        ("Jaipur Royal Heritage Palace", "Hotel Rooms", "Heritage Rajputana", "₹2,600", "₹3,700", "+₹1,100 (42%)", "10,000 units"),
        ("Bangkok Direct Flight Blocks", "Flight Seats", "Siam Skyway Airlines", "₹9,000", "₹11,200", "+₹2,200 (24%)", "15,500 seats"),
        ("Kerala Ayurvedic Backwaters", "Resorts", "Backwater Serenity", "₹4,200", "₹5,900", "+₹1,700 (40%)", "6,500 units")
    ]
    
    for idx, r in enumerate(rows):
        ry = 195 + idx * 54
        # Alternate row bg
        if idx % 2 == 1:
            draw.rectangle([41, ry, WIDTH - 41, ry + 50], fill=(253, 252, 250))
        draw.line([40, ry + 50, WIDTH - 40, ry + 50], fill=BORDER_COLOR, width=1)
        
        draw.text((60, ry + 14), r[0], font=font_sans_bold, fill=TEXT_PRIMARY)
        draw.text((320, ry + 14), r[1], font=font_sans_med, fill=TEXT_SECONDARY)
        draw.text((460, ry + 14), r[2], font=font_sans_small, fill=TEXT_SECONDARY)
        draw.text((680, ry + 14), r[3], font=font_mono_small, fill=TEXT_PRIMARY)
        draw.text((800, ry + 14), r[4], font=font_mono_small, fill=TEXT_PRIMARY)
        draw.text((930, ry + 14), r[5], font=font_mono_small, fill=FOREST_PRIMARY)
        draw.text((1080, ry + 14), r[6], font=font_sans_small, fill=TEXT_SECONDARY)

    return img

def render_scene_4(frame_in_scene):
    # SCENE 4: AI Demand Forecasting
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_IVORY)
    draw = ImageDraw.Draw(img)
    draw_topbar(draw, 4, "AI Demand Forecasting (P10/P50/P90)")
    
    draw.text((40, 75), "Multi-Horizon Time-Series Demand Forecasting", font=font_serif_med, fill=TEXT_PRIMARY)
    draw.text((40, 108), "Seasonal decomposition, YoY growth extraction & rolling backtest uncertainty tunnels", font=font_sans_small, fill=TEXT_SECONDARY)
    
    # 4 Horizon KPI Cards
    h_kpis = [
        ("CUMULATIVE DEMAND", "2,450 Units", "12-Week buying horizon", FOREST_PRIMARY),
        ("UNCERTAINTY TUNNEL", "±120 / Wk", "Derived from 26-wk backtest", FOREST_DEEP),
        ("P10 CONSERVATIVE", "1,980 Units", "Downside risk protection", TEXT_SECONDARY),
        ("P90 OPTIMISTIC", "2,920 Units", "Festive demand surge cap", ORANGE_ACCENT)
    ]
    for idx, (title, val, sub, col) in enumerate(h_kpis):
        cx = 40 + idx * 304
        cy = 140
        draw.rounded_rectangle([cx, cy, cx + 288, cy + 90], radius=14, fill=WHITE, outline=BORDER_COLOR)
        draw.text((cx + 16, cy + 12), title, font=font_mono_small, fill=TEXT_MUTED)
        draw.text((cx + 16, cy + 34), val, font=font_mono_bold, fill=col)
        draw.text((cx + 16, cy + 64), sub, font=font_sans_small, fill=TEXT_SECONDARY)
        
    # Big Interactive Chart
    draw.rounded_rectangle([40, 250, WIDTH - 40, 640], radius=16, fill=WHITE, outline=BORDER_COLOR)
    draw.text((64, 270), "Goa Luxury Beachfront Rooms · Weekly Booking Trajectory", font=font_serif_small, fill=TEXT_PRIMARY)
    
    # Legends
    draw.rectangle([700, 274, 715, 284], fill=TEXT_SECONDARY)
    draw.text((722, 272), "Historical Bookings", font=font_sans_small, fill=TEXT_PRIMARY)
    draw.line([850, 279, 870, 279], fill=FOREST_PRIMARY, width=3)
    draw.text((876, 272), "P50 Baseline Forecast", font=font_sans_small, fill=TEXT_PRIMARY)
    draw.rectangle([1030, 274, 1045, 284], fill=FOREST_LIGHT, outline=FOREST_PRIMARY)
    draw.text((1052, 272), "P10–P90 Confidence Tunnel", font=font_sans_small, fill=TEXT_PRIMARY)
    
    # Draw large chart
    cy_base = 590
    draw.line([80, cy_base, WIDTH - 80, cy_base], fill=BORDER_COLOR, width=1)
    
    # 26 historical weeks
    hist_points = []
    for w in range(26):
        x = 90 + w * 24
        # sinusoidal demand + noise
        y = cy_base - int(120 + 80 * math.sin(w * 0.35) + w * 3)
        hist_points.append((x, y))
    
    for i in range(len(hist_points)-1):
        draw.line([hist_points[i], hist_points[i+1]], fill=TEXT_SECONDARY, width=3)
        # Random sold-out outlier red dots
        if i in [7, 14, 21]:
            draw.ellipse([hist_points[i][0]-5, hist_points[i][1]-5, hist_points[i][0]+5, hist_points[i][1]+5], fill=RED_ACCENT)
            draw.text((hist_points[i][0]-15, hist_points[i][1]-20), "Sold-out", font=font_sans_small, fill=RED_ACCENT)
            
    # Separator
    sep_x = hist_points[-1][0]
    draw.line([sep_x, 320, sep_x, cy_base], fill=FOREST_PRIMARY, width=2)
    draw.rounded_rectangle([sep_x - 30, 310, sep_x + 30, 335], radius=6, fill=BG_CREAM, outline=FOREST_PRIMARY)
    draw.text((sep_x - 22, 316), "TODAY", font=font_mono_small, fill=FOREST_PRIMARY)
    
    # Forecast tunnel
    p10_pts = []
    p50_pts = []
    p90_pts = []
    for f_idx in range(16):
        fx = sep_x + (f_idx + 1) * 28
        fy_p50 = hist_points[-1][1] - int(f_idx * 5 + 40 * math.sin(f_idx * 0.4))
        p50_pts.append((fx, fy_p50))
        p10_pts.append((fx, fy_p50 + 45))
        p90_pts.append((fx, fy_p50 - 45))
        
    # Draw Confidence Tunnel polygon
    tunnel_poly = p90_pts + p10_pts[::-1]
    draw.polygon(tunnel_poly, fill=(234, 247, 238, 120), outline=BORDER_COLOR)
    for i in range(len(p50_pts)-1):
        draw.line([p50_pts[i], p50_pts[i+1]], fill=FOREST_PRIMARY, width=3)

    return img

def render_scene_5(frame_in_scene):
    # SCENE 5: Procurement Recommendations
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_IVORY)
    draw = ImageDraw.Draw(img)
    draw_topbar(draw, 5, "Procurement Recommendations")
    
    draw.text((40, 75), "Autonomous Procurement Recommendation Engine", font=font_serif_med, fill=TEXT_PRIMARY)
    draw.text((40, 108), "Actionable PRE-BUY, BUY PARTLY, and SKIP decisions powered by Newsvendor Critical Ratios", font=font_sans_small, fill=TEXT_SECONDARY)
    
    recs = [
        ("Goa Beachfront Resort", "Hotel Rooms", "PRE-BUY", "2,400 Units", "₹76.8 Lakhs", "₹28.8 Lakhs", "98%", "Strong YoY seasonal surge; low cancellation slippage. Secure full supplier allocation block.", FOREST_PRIMARY, FOREST_LIGHT),
        ("Dubai Gulf Charters", "Flight Seats", "PRE-BUY", "1,800 Seats", "₹2.52 Crores", "₹50.4 Lakhs", "96%", "High winter holiday demand corridor. Wholesale seat cost undercuts spot market by 24%.", FOREST_PRIMARY, FOREST_LIGHT),
        ("Bali Ocean Pool Suites", "Resorts", "BUY PARTLY", "880 Units", "₹54.5 Lakhs", "₹21.1 Lakhs", "78%", "Moderate demand variance. Cap purchase at 78% service level to prevent leftover room spoilage.", ORANGE_ACCENT, ORANGE_LIGHT),
        ("Maldives Atoll Villas", "Villas", "SKIP", "0 Units", "₹0.00", "₹0.00", "0%", "18% cancellation volatility elevates overage cost Co beyond underage margin Cu. Unsold penalty too high.", RED_ACCENT, RED_LIGHT)
    ]
    
    cw = 282
    for idx, (dest, cat, verdict, units, spend, profit, st, reason, col, bg_col) in enumerate(recs):
        cx = 40 + idx * (cw + 24)
        cy = 140
        draw.rounded_rectangle([cx, cy, cx + cw, cy + 490], radius=16, fill=WHITE, outline=BORDER_COLOR)
        
        # Verdict Badge
        draw.rounded_rectangle([cx + 16, cy + 18, cx + 110, cy + 46], radius=8, fill=bg_col, outline=col)
        draw.text((cx + 24, cy + 24), verdict, font=font_mono_small, fill=col)
        
        draw.text((cx + 16, cy + 60), dest, font=font_serif_small, fill=TEXT_PRIMARY)
        draw.text((cx + 16, cy + 86), cat, font=font_sans_small, fill=TEXT_SECONDARY)
        
        # Metrics Box
        draw.rounded_rectangle([cx + 16, cy + 114, cx + cw - 16, cy + 310], radius=12, fill=BG_IVORY, outline=BORDER_COLOR)
        
        m_items = [
            ("RECOMMENDED BUY", units, TEXT_PRIMARY),
            ("CAPITAL SPEND", spend, FOREST_PRIMARY),
            ("EXPECTED PROFIT", profit, FOREST_PRIMARY),
            ("SELL-THROUGH", st, col)
        ]
        for m_idx, (mlabel, mval, mcol) in enumerate(m_items):
            my = cy + 126 + m_idx * 44
            draw.text((cx + 26, my), mlabel, font=font_sans_small, fill=TEXT_MUTED)
            draw.text((cx + 26, my + 16), mval, font=font_mono_small, fill=mcol)
            
        # Reason
        draw.text((cx + 16, cy + 326), "AI Rationalization:", font=font_sans_bold, fill=TEXT_PRIMARY)
        words = reason.split()
        for w_idx, line in enumerate([" ".join(words[i:i+5]) for i in range(0, len(words), 5)]):
            draw.text((cx + 16, cy + 352 + w_idx * 18), line, font=font_sans_small, fill=TEXT_SECONDARY)

    return img

def render_scene_6(frame_in_scene):
    # SCENE 6: Budget Optimization
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_IVORY)
    draw = ImageDraw.Draw(img)
    draw_topbar(draw, 6, "Budget Optimization & Knapsack")
    
    draw.text((40, 75), "Capital Budget Allocation & Greedy Knapsack Optimizer", font=font_serif_med, fill=TEXT_PRIMARY)
    draw.text((40, 108), "Deploy fixed capital to maximize expected profit per rupee while strictly constraining unsold inventory", font=font_sans_small, fill=TEXT_SECONDARY)
    
    # Left Control Simulation
    draw.rounded_rectangle([40, 140, 520, 640], radius=16, fill=WHITE, outline=BORDER_COLOR)
    draw.text((64, 165), "Procurement Capital Parameters", font=font_serif_small, fill=TEXT_PRIMARY)
    
    # Budget Slider Display
    draw.text((64, 210), "Total Capital Budget Ceiling", font=font_sans_bold, fill=TEXT_PRIMARY)
    draw.text((410, 208), "₹10.00 Cr", font=font_mono_bold, fill=FOREST_PRIMARY)
    draw.rounded_rectangle([64, 240, 480, 250], radius=5, fill=BORDER_COLOR)
    draw.rounded_rectangle([64, 240, 360, 250], radius=5, fill=FOREST_PRIMARY)
    draw.ellipse([350, 235, 370, 255], fill=WHITE, outline=FOREST_PRIMARY, width=3)
    
    # Lambda Risk Slider Display
    draw.text((64, 280), "Unsold-Risk Aversion (λ)", font=font_sans_bold, fill=TEXT_PRIMARY)
    draw.text((435, 278), "0.40", font=font_mono_bold, fill=ORANGE_ACCENT)
    draw.text((64, 304), "Profile: Balanced Profit & Risk Target", font=font_sans_small, fill=FOREST_PRIMARY)
    draw.rounded_rectangle([64, 326, 480, 336], radius=5, fill=BORDER_COLOR)
    draw.rounded_rectangle([64, 326, 230, 336], radius=5, fill=ORANGE_ACCENT)
    draw.ellipse([220, 321, 240, 341], fill=WHITE, outline=ORANGE_ACCENT, width=3)
    
    # Summary Card
    draw.rounded_rectangle([64, 370, 480, 610], radius=12, fill=BG_IVORY, outline=BORDER_COLOR)
    draw.text((84, 390), "Optimization Verdict", font=font_serif_small, fill=TEXT_PRIMARY)
    
    metrics = [
        ("Capital Deployed", "₹9.98 Cr of ₹10.00 Cr (99.8%)"),
        ("Projected Net Profit", "₹2.14 Cr (+21.4% Return)"),
        ("Expected Sell-Through", "96% Clearance Rate"),
        ("Alpha Outperformance", "+18% vs Equal Split Benchmark"),
        ("Risk Penalty Applied", "λ = 0.40 · 60% Salvage Deducted")
    ]
    for idx, (m_label, m_val) in enumerate(metrics):
        my = 425 + idx * 36
        draw.text((84, my), m_label, font=font_sans_small, fill=TEXT_MUTED)
        draw.text((84, my + 14), m_val, font=font_sans_bold, fill=FOREST_PRIMARY)
        
    # Right Side Allocation Table
    draw.rounded_rectangle([550, 140, WIDTH - 40, 640], radius=16, fill=WHITE, outline=BORDER_COLOR)
    draw.text((574, 165), "Asset Capital Allocation Distribution", font=font_serif_small, fill=TEXT_PRIMARY)
    
    alloc_rows = [
        ("Dubai Flight Charters", "₹2.52 Cr", "25.2%", "+₹50.4L", "PRE-BUY", FOREST_PRIMARY),
        ("Goa Beachfront Hotels", "₹1.88 Cr", "18.8%", "+₹28.8L", "PRE-BUY", FOREST_PRIMARY),
        ("Bali Ocean Suites", "₹1.45 Cr", "14.5%", "+₹21.1L", "BUY PARTLY", ORANGE_ACCENT),
        ("Bangkok Flight Seats", "₹1.32 Cr", "13.2%", "+₹18.4L", "BUY PARTLY", ORANGE_ACCENT),
        ("Jaipur Palace Hotels", "₹1.15 Cr", "11.5%", "+₹14.2L", "BUY PARTLY", ORANGE_ACCENT),
        ("Singapore Hotels", "₹0.98 Cr", "9.8%", "+₹11.0L", "BUY PARTLY", ORANGE_ACCENT),
        ("Kerala Retreat Stays", "₹0.68 Cr", "6.8%", "+₹8.5L", "BUY PARTLY", ORANGE_ACCENT),
        ("Maldives Luxury Villas", "₹0.00 Cr", "0.0%", "₹0.0L", "SKIP", RED_ACCENT)
    ]
    
    draw.rectangle([550, 200, WIDTH - 40, 235], fill=BG_CREAM)
    draw.text((574, 210), "ASSET", font=font_mono_small, fill=TEXT_MUTED)
    draw.text((760, 210), "SPEND", font=font_mono_small, fill=TEXT_MUTED)
    draw.text((870, 210), "BUDGET %", font=font_mono_small, fill=TEXT_MUTED)
    draw.text((980, 210), "PROFIT", font=font_mono_small, fill=TEXT_MUTED)
    draw.text((1110, 210), "VERDICT", font=font_mono_small, fill=TEXT_MUTED)
    
    for idx, (aname, aspend, apct, aprof, averd, acol) in enumerate(alloc_rows):
        ry = 245 + idx * 46
        draw.line([550, ry + 42, WIDTH - 40, ry + 42], fill=BORDER_COLOR, width=1)
        draw.text((574, ry + 12), aname, font=font_sans_bold, fill=TEXT_PRIMARY)
        draw.text((760, ry + 12), aspend, font=font_mono_small, fill=TEXT_PRIMARY)
        draw.text((870, ry + 12), apct, font=font_mono_small, fill=TEXT_SECONDARY)
        draw.text((980, ry + 12), aprof, font=font_mono_small, fill=FOREST_PRIMARY)
        draw.text((1110, ry + 12), averd, font=font_mono_small, fill=acol)

    return img

def render_scene_7(frame_in_scene):
    # SCENE 7: Risk Analysis
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_IVORY)
    draw = ImageDraw.Draw(img)
    draw_topbar(draw, 7, "Inventory Risk Analysis")
    
    draw.text((40, 75), "Perishable Inventory Risk & Cancellation Sensitivity", font=font_serif_med, fill=TEXT_PRIMARY)
    draw.text((40, 108), "Protecting working capital through salvage floors, cancellation slippage modeling & exposure scoring", font=font_sans_small, fill=TEXT_SECONDARY)
    
    # 3 Pillar Cards
    pillars = [
        ("Perishable Spoilage Risk", "Unsold inventory loses 100% value upon check-in. StockPilot models a 25% salvage liquidation recovery floor through B2B distress channels.", "Salvage Recovery Floor: 25%", RED_ACCENT, RED_LIGHT),
        ("Cancellation Slippage", "Customer cancellations directly erode wholesale margins. Formula deducts 50% of cancellation rate from gross revenue expectation.", "Penalty: Revenue · (1 - 0.5·Cancel)", ORANGE_ACCENT, ORANGE_LIGHT),
        ("Unsold Risk Penalty (λ)", "Managerial risk parameter penalizes leftover stock: J(q) = Profit - λ · 0.60 · Cost · UnsoldUnits to eliminate catastrophic overhang.", "Objective: Maximize Risk-Adjusted J(q)", FOREST_PRIMARY, FOREST_LIGHT)
    ]
    for idx, (title, desc, badge, col, bg_col) in enumerate(pillars):
        cx = 40 + idx * 408
        cy = 140
        draw.rounded_rectangle([cx, cy, cx + 384, cy + 220], radius=16, fill=WHITE, outline=BORDER_COLOR)
        draw.text((cx + 20, cy + 20), title, font=font_serif_small, fill=TEXT_PRIMARY)
        
        words = desc.split()
        for l_idx, line in enumerate([" ".join(words[i:i+6]) for i in range(0, len(words), 6)]):
            draw.text((cx + 20, cy + 56 + l_idx * 20), line, font=font_sans_small, fill=TEXT_SECONDARY)
            
        draw.rounded_rectangle([cx + 20, cy + 165, cx + 360, cy + 195], radius=8, fill=bg_col, outline=col)
        draw.text((cx + 32, cy + 172), badge, font=font_mono_small, fill=col)
        
    # Bottom Risk Ratings Matrix
    draw.rounded_rectangle([40, 390, WIDTH - 40, 640], radius=16, fill=WHITE, outline=BORDER_COLOR)
    draw.text((64, 410), "Destination Asset Risk Heat Scores", font=font_serif_small, fill=TEXT_PRIMARY)
    
    draw.rectangle([40, 440, WIDTH - 40, 475], fill=BG_CREAM)
    draw.text((64, 450), "DESTINATION", font=font_mono_small, fill=TEXT_MUTED)
    draw.text((280, 450), "CATEGORY", font=font_mono_small, fill=TEXT_MUTED)
    draw.text((450, 450), "CANCEL RATE", font=font_mono_small, fill=TEXT_MUTED)
    draw.text((620, 450), "SELL-THROUGH", font=font_mono_small, fill=TEXT_MUTED)
    draw.text((800, 450), "RISK SCORE", font=font_mono_small, fill=TEXT_MUTED)
    draw.text((1060, 450), "RATING", font=font_mono_small, fill=TEXT_MUTED)
    
    risk_rows = [
        ("Goa Beachfront Resort", "Hotel Rooms", "12%", "98%", 14, "LOW RISK", FOREST_PRIMARY),
        ("Dubai Gulf Charters", "Flight Seats", "8%", "96%", 18, "LOW RISK", FOREST_PRIMARY),
        ("Bali Ocean Pool Suites", "Resorts", "15%", "78%", 32, "MODERATE", ORANGE_ACCENT),
        ("Maldives Overwater Bungalows", "Villas", "18%", "0%", 74, "HIGH RISK", RED_ACCENT)
    ]
    for idx, (dname, dcat, dcan, dst, dscore, drate, dcol) in enumerate(risk_rows):
        ry = 485 + idx * 36
        draw.line([40, ry + 32, WIDTH - 40, ry + 32], fill=BORDER_COLOR, width=1)
        draw.text((64, ry + 6), dname, font=font_sans_bold, fill=TEXT_PRIMARY)
        draw.text((280, ry + 6), dcat, font=font_sans_small, fill=TEXT_SECONDARY)
        draw.text((450, ry + 6), dcan, font=font_mono_small, fill=TEXT_PRIMARY)
        draw.text((620, ry + 6), dst, font=font_mono_small, fill=FOREST_PRIMARY)
        # Score bar
        draw.rounded_rectangle([800, ry + 10, 800 + 160, ry + 20], radius=5, fill=BORDER_COLOR)
        draw.rounded_rectangle([800, ry + 10, 800 + int(1.6 * dscore), ry + 20], radius=5, fill=dcol)
        draw.text((980, ry + 6), f"{dscore}/100", font=font_mono_small, fill=dcol)
        draw.text((1060, ry + 6), drate, font=font_mono_small, fill=dcol)

    return img

def render_scene_8(frame_in_scene):
    # SCENE 8: Conclusion
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_IVORY)
    draw = ImageDraw.Draw(img)
    draw_topbar(draw, 8, "Summary & Next Steps")
    
    t = frame_in_scene / FRAMES_PER_SCENE
    offset_y = int(math.sin(t * math.pi * 2) * 4)
    
    # Large Logo Center
    draw_logo(draw, WIDTH//2 - 130, 160 + offset_y, 45)
    draw.text((WIDTH//2 - 70, 150 + offset_y), "StockPilot AI", font=font_serif_huge, fill=TEXT_PRIMARY)
    
    # Conclusion Main Message
    draw.text((WIDTH//2 - 380, 240 + offset_y), "Make Smarter Procurement Decisions with StockPilot AI.", font=font_serif_large, fill=FOREST_PRIMARY)
    draw.arc([WIDTH//2 - 380, 285 + offset_y, WIDTH//2 + 380, 305 + offset_y], 0, 180, fill=ORANGE_ACCENT, width=4)
    
    sub = "Eliminate human guesswork. Forecast seasonal demand. Maximize capital return."
    draw.text((WIDTH//2 - 275, 315 + offset_y), sub, font=font_sans_med, fill=TEXT_SECONDARY)
    
    # CTA Button Box
    draw.rounded_rectangle([WIDTH//2 - 170, 380 + offset_y, WIDTH//2 + 170, 440 + offset_y], radius=30, fill=FOREST_PRIMARY)
    draw.text((WIDTH//2 - 120, 398 + offset_y), "Start 14-Day Free Trial →", font=font_sans_bold, fill=WHITE)
    
    # Who it's built for
    draw.rounded_rectangle([WIDTH//2 - 420, 490 + offset_y, WIDTH//2 + 420, 600 + offset_y], radius=16, fill=WHITE, outline=BORDER_COLOR)
    draw.text((WIDTH//2 - 400, 510 + offset_y), "BUILT FOR ENTERPRISE TRAVEL OPERATORS", font=font_mono_small, fill=TEXT_MUTED)
    
    specs = [
        "Online Travel Agencies (OTAs)",
        "Flight & Charter Wholesalers",
        "Hotel Revenue & Procurement",
        "Inbound Tour Operators"
    ]
    for idx, sp in enumerate(specs):
        sx = WIDTH//2 - 400 + idx * 200
        draw.text((sx, 545 + offset_y), f"✦ {sp}", font=font_sans_small, fill=FOREST_DEEP)

    return img

def main():
    print(f"Generating professional StockPilot AI product demo video...")
    print(f"Target: {OUTPUT_PATH}")
    print(f"Resolution: {WIDTH}x{HEIGHT} @ {FPS} FPS, {TOTAL_FRAMES} frames (~{TOTAL_FRAMES//FPS} seconds)")
    
    writer = imageio.get_writer(
        OUTPUT_PATH,
        fps=FPS,
        codec='libx264',
        quality=8,
        macro_block_size=16
    )
    
    renderers = [
        render_scene_1,
        render_scene_2,
        render_scene_3,
        render_scene_4,
        render_scene_5,
        render_scene_6,
        render_scene_7,
        render_scene_8
    ]
    
    frame_count = 0
    for scene_idx, renderer in enumerate(renderers):
        print(f"Rendering Scene {scene_idx + 1}/8...")
        for f in range(FRAMES_PER_SCENE):
            img = renderer(f)
            # Add bottom progress bar
            draw = ImageDraw.Draw(img)
            draw_progress_bar(draw, frame_count)
            
            # Convert to numpy and write
            frame_arr = np.array(img)
            writer.append_data(frame_arr)
            frame_count += 1
            
    writer.close()
    size_mb = os.path.getsize(OUTPUT_PATH) / (1024 * 1024)
    print(f"Done! Created video: {OUTPUT_PATH} ({size_mb:.2f} MB)")

if __name__ == '__main__':
    main()
