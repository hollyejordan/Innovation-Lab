﻿from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import time
from tabulate import tabulate


def translate_text_with_web(text, target_lang='zh'):
    # Initialize WebDriver
    driver = webdriver.Chrome()  # Use Chrome browser
    driver.get("https://libretranslate.com/")

    # Wait for the page to load
    time.sleep(2)

    # Enter the text to be translated
    input_box = driver.find_element(By.ID, "textarea1")
    input_box.send_keys(text)

    # Select the target language
    select_element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, 'select[aria-labelledby="targetLangLabel"]'))
    )
    select = Select(select_element)
    select.select_by_value(target_lang)

    # Wait for the translation to complete
    print("translating...")
    time.sleep(10)

    # Get translation results
    translated_text = driver.find_element(By.ID, "textarea2").get_attribute("value")

    # Close the browser
    driver.quit()

    return translated_text


def main():
    text = input("Please enter the content to be translated: ")

    # target language
    data = [["albanian", "sq"],["Arabic","ar"],["Azerbaijani","az"],["Gaeilge","ga"],["Estonian","et"],["Bulgarian","bg"],
            ["Polish", "bl"],["farsi","fa"],["Danish","da"],["German","de"],["Russian","ru"],["French","fr"],
            ["Finnish", "fi"],["Korean","ko"],["Dutch","nl"],["Catalan","ca"],["Czech","cs"],["latvian","lv"],
            ["Lithuanian", "lt"],["Romanian","ro"],["Malay","ms"],["Bengali","bn"],["Portuguese","pt"],["Japanese","ja"],
            ["Swedish", "sv"],["Serbian","sr"],["Esperanto","eo"],["Slovak","sk"],["Snovenian language","sl"],["Thai","th"],
            ["Turkish", "tr"],["Urdu","ur"],["Ukrainian","uk"],["Spanish","es"],["Hebrew","he"],["Greek","el"],
            ["Hungarian", "hu"],["Italian","it"],["Hindi","hi"],["Indonesian","id"],["Vietnamese","vi"],["traditional Chinese","zt"],
            ["Simplified Chinese", "zh"],["English","en"]]
    headers = ["target language", "code"]
    print(tabulate(data, headers=headers, tablefmt="github", stralign="center", numalign="center"))

    lang_list = ["sq","ar","az","ga","et","bg","bl","fa","da","de","ru","fr","fi","ko","nl","ca","cs","lv",
                 "lt","ro","ms","bn","pt","ja","sv","sr","eo","sk","sl","th","tr","ur","uk","es","he","el",
                 "hu","it","hi","id","vi","zt","en","zh"]
    target_lang = ""

    # Ensure that the target language code is a valid input
    while target_lang not in lang_list:
        target_lang = input("Please enter the code for the target language: ")
        if target_lang not in lang_list:
            print("Unable to recognize the target language. Please re-enter the target language code")

    translated_text = translate_text_with_web(text, target_lang=target_lang)

    if translated_text:
        # The results are recorded in result.txt while being printed
        with open("result.txt", "w", encoding="utf-8") as f:
            f.write(translated_text)
        print("Translation results:\n", translated_text)
    else:
        print("Translation failed. Please check your input or try again later。")


if __name__ == "__main__":
    main()