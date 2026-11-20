"""Calculator check for uae.html. Run: python tests/check_calc.py (needs Playwright + Chromium)."""
import pathlib
from playwright.sync_api import sync_playwright

PAGE = (pathlib.Path(__file__).resolve().parent.parent / "uae.html").as_uri()

# (field, typed value, expected error text or "" for valid, expected button disabled)
CASES = [
    ("#send-amt", "100", "", False),
    ("#send-amt", "-5", "negative", True),
    ("#send-amt", "abc", "numbers only", True),
    ("#send-amt", "1.2.3", "numbers only", True),
    ("#send-amt", "0", "above zero", True),
    ("#send-amt", "", "Enter an amount", True),
    ("#send-amt", "9.99", "Minimum is AED 10", True),
    ("#send-amt", "50000", "", False),
    ("#send-amt", "50000.01", "Maximum is AED 50,000", True),
    ("#recv-amt", "2264", "", False),          # = AED 100 at 22.64
    ("#recv-amt", "100", "Minimum is AED 10", True),  # = AED 4.42
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(reduced_motion="reduce")  # no preloader / animations: test the calculator itself
    page.goto(PAGE)
    for field, value, err, disabled in CASES:
        page.fill(field, value)
        page.wait_for_timeout(600)  # let number roll finish
        msg = page.text_content("#calc-err")
        assert (err in msg) if err else msg == "", (field, value, msg)
        assert page.is_disabled("#calc-btn") == disabled, (field, value, "button state")
    page.fill("#send-amt", "250")
    page.select_option("#recv-ccy", "PKR")
    page.wait_for_timeout(600)
    assert page.input_value("#recv-amt") == "19,100.00"
    assert page.text_content("#s-tot") == "AED 251.00"
    # "Your money. Your way." bars follow the calculator
    assert page.text_content("#cmp-send") == "250.00"
    assert page.text_content("#cmp-code") == "PKR"
    assert page.text_content("#w-bank") == "19,100.00 PKR"
    assert page.text_content("#w-branch") == "AED 251.00"
    browser.close()
print("calculator: all checks passed")
