import os
import re
import sys
import mimetypes
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)

mimetypes.add_type("application/wasm", ".wasm")
mimetypes.add_type("application/javascript", ".js")

class RangeRequestHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def send_head(self):
        path = self.translate_path(self.path)

        if os.path.isdir(path):
            return super().send_head()

        if not os.path.exists(path):
            self.send_error(404, "File not found")
            return None

        ctype = self.guess_type(path)
        file_size = os.path.getsize(path)
        range_header = self.headers.get("Range")

        if not range_header:
            return super().send_head()

        match = re.match(r"bytes=(\d*)-(\d*)", range_header)
        if not match:
            self.send_error(416, "Invalid Range")
            return None

        start_s, end_s = match.groups()

        if start_s:
            start = int(start_s)
        else:
            suffix = int(end_s)
            start = max(0, file_size - suffix)

        end = int(end_s) if end_s and start_s else file_size - 1
        end = min(end, file_size - 1)

        if start >= file_size or start > end:
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{file_size}")
            self.end_headers()
            return None

        f = open(path, "rb")
        self.send_response(206)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Last-Modified", self.date_time_string(os.path.getmtime(path)))
        self.end_headers()

        f.seek(start)
        self._range = (start, end)
        return f

    def copyfile(self, source, outputfile):
        if hasattr(self, "_range"):
            start, end = self._range
            remaining = end - start + 1
            while remaining > 0:
                chunk = source.read(min(1024 * 1024, remaining))
                if not chunk:
                    break
                outputfile.write(chunk)
                remaining -= len(chunk)
            del self._range
        else:
            super().copyfile(source, outputfile)

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
server = ThreadingHTTPServer(("127.0.0.1", port), RangeRequestHandler)
print(f"XP Range Server: http://127.0.0.1:{port}/")
print("Ctrl+C ile kapatabilirsiniz.")
server.serve_forever()
