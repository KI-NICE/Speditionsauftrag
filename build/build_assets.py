"""Erzeugt assets.js (Beschriftungen für den PDF-Export, Logo, Fußzeile).
Aufruf: python3 build/build_assets.py"""
import json, base64, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)


def b64(path):
    return base64.b64encode(open(os.path.join(HERE, path), "rb").read()).decode()


if __name__ == "__main__":
    labels = json.load(open(os.path.join(HERE, "labels.json"), encoding="utf8"))
    js = ("/* Automatisch erzeugt durch build/build_assets.py – nicht von Hand bearbeiten */\n"
          "window.ASSETS = " + json.dumps({
              "labels": labels,
              "logo": "data:image/png;base64," + b64("logo.png"),
              "footer": "data:image/png;base64," + b64("footer.png"),
          }, ensure_ascii=False) + ";\n")
    open(os.path.join(OUT, "assets.js"), "w", encoding="utf8").write(js)
    print("ok", len(js))
