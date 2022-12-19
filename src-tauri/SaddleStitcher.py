import argparse
import PyPDF2


def new_page_index(pages, dir):
    page_index = []
    last_page = ((pages + 3) // 4 * 4) - 1

    i = 0
    j = last_page
    while i <= j:
        page_index.append(j)
        j = j - 1
        page_index.append(i)
        i = i + 1

    # print(page_index)

    i = 0 if dir == 'right' else 2
    while i < last_page:
        tmp = page_index[i]
        page_index[i] = page_index[i + 1]
        page_index[i + 1] = tmp
        i = i + 4

    # print(page_index)

    return page_index


def rearrange_pdf(src, dst, dir):
    pdf_src = PyPDF2.PdfFileReader(src, strict=False)
    num_pages = pdf_src.getNumPages()
    # print(num_pages)
    page_index = new_page_index(num_pages, dir)

    pdf_tmp = PyPDF2.PdfFileWriter()
    for i in range(0, len(page_index)):
        if i < num_pages:
            pdf_tmp.addPage(pdf_src.getPage(i))
        else:
            pdf_tmp.addBlankPage()

    pdf_single = PyPDF2.PdfFileWriter()
    for i in page_index:
        pdf_single.addPage(pdf_tmp.getPage(i))

    pdf_dst = PyPDF2.PdfFileWriter()
    for i in range(0, len(page_index), 2):
        p1 = pdf_single.getPage(i)
        p2 = pdf_single.getPage(i + 1)

        # 見開きにしたページサイズ
        total_width = p1.mediaBox.getUpperRight_x() + p2.mediaBox.getUpperRight_x()
        total_height = max([p1.mediaBox.getUpperRight_y(),
                            p1.mediaBox.getUpperRight_y()])

        # ページを貼り付ける空白ページ
        p = PyPDF2.PageObject.create_blank_page(width=total_width,
                                                height=total_height)
        # 左側のページを貼り付け
        p.mergePage(p1)
        # 右側のページを位置を指定して貼り付け
        p.mergeTranslatedPage(p2, p1.mediaBox.getUpperRight_x(), 0)

        # 見開きにしたページを出力用オブジェクトに追加
        pdf_dst.addPage(p)

    with open(dst, mode='wb') as f:
        pdf_dst.write(f)


if __name__ == '__main__':
    # パーサーのインスタンスを作成
    parser = argparse.ArgumentParser()

    # 引数を受け取る
    parser.add_argument('inp')
    parser.add_argument('out')
    parser.add_argument('dir')

    # 引数を解析
    args = parser.parse_args()

    # 受け取った引数を出力
    # print('inp =', args.inp)
    # print('out =', args.out)

    rearrange_pdf(args.inp, args.out, args.dir)
