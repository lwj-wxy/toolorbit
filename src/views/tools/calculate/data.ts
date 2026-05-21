import type { TechnicalOverview } from '../../../types/tool-overview';

type BilingualOverview = {
  zh: TechnicalOverview;
  en: TechnicalOverview;
};

export const CALCULATE_TOOL_OVERVIEWS: Record<string, BilingualOverview> = {
  'unit-converter': {
    zh: {
      summary:
        '单位换算工具用于在长度、重量、体积和温度等常见计量单位之间进行即时换算。适合跨地区商品规格整理、工程草图尺寸校对、食谱或物流体积换算、学习材料中的单位题目检查，以及将英制和公制数据统一到同一表达方式。工具会根据当前分类加载对应单位组，输入数值后实时计算目标单位结果，避免在不同换算公式之间手动切换。所有计算均在浏览器本地完成。',
      input:
        '需要换算的数值、单位分类、源单位和目标单位。长度支持米、千米、厘米、毫米、英寸、英尺、码、英里；重量支持克、千克、毫克、磅、盎司；体积支持升、毫升、立方米、加仑和品脱；温度支持摄氏、华氏和开尔文。切换分类时会自动重置为该分类下的默认单位。',
      output:
        '目标单位下的等价值，保留合理精度并可直接复制或继续作为其它换算输入。温度换算会使用摄氏、华氏、开尔文之间的专用公式；其它线性单位会先转换到基础单位，再换算到目标单位，保证不同单位之间的结果一致。',
      processing:
        '线性单位采用“源单位系数 → 基准单位 → 目标单位系数”的方式计算；温度单位采用独立转换函数处理偏移量和比例，避免将温度误当作普通倍数换算。组件状态变化后在浏览器内同步重新计算，不依赖服务端接口，也不会上传输入数据。',
      modes: ['长度换算', '重量换算', '体积换算', '温度换算', '源/目标单位切换', '实时结果'],
      example: {
        title: '单位换算输入到输出示例',
        input: '分类: 长度\n输入: 12\n源单位: 英寸\n目标单位: 厘米',
        output: '30.48 厘米',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Unit Converter performs instant conversions across common measurement groups including length, weight, volume, and temperature. It is useful for normalizing product specifications across regions, checking dimensions in engineering sketches, converting recipe or logistics volume values, reviewing unit exercises in learning materials, and aligning imperial and metric data into one format. The tool loads the correct unit set for the selected category and recalculates the target value as you type, so you do not need to switch formulas manually. All calculations run locally in the browser.',
      input:
        'The numeric value to convert, a unit category, a source unit, and a target unit. Length supports meter, kilometer, centimeter, millimeter, inch, foot, yard, and mile; weight supports gram, kilogram, milligram, pound, and ounce; volume supports liter, milliliter, cubic meter, gallon, and pint; temperature supports Celsius, Fahrenheit, and Kelvin. Changing the category resets the unit selectors to sensible defaults for that category.',
      output:
        'The equivalent value in the target unit, with practical precision for direct copying or reuse as another conversion input. Temperature conversions use dedicated formulas between Celsius, Fahrenheit, and Kelvin; other linear units are converted through a base unit first, keeping results consistent across unit pairs.',
      processing:
        'Linear units are calculated through a source-factor to base-unit to target-factor pipeline. Temperature units use independent conversion functions to handle offset and scale correctly instead of treating temperature as a simple multiplier. State changes trigger synchronous browser-side recalculation without server requests or data uploads.',
      modes: ['Length conversion', 'Weight conversion', 'Volume conversion', 'Temperature conversion', 'Swap source/target units', 'Live result'],
      example: {
        title: 'Unit conversion input-to-output example',
        input: 'Category: Length\nInput: 12\nSource unit: inch\nTarget unit: centimeter',
        output: '30.48 centimeters',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'time-converter': {
    zh: {
      summary:
        '时区时间转换工具用于将一个基准时间同步换算到多个目标时区，适合远程会议排期、跨境运营排班、海外发布窗口确认、客服覆盖时间规划，以及在不同城市之间核对日期是否跨天。工具支持选择基准时区和时间，也能一键填入当前时间，并在右侧同时展示多个目标时区的本地时间与 UTC 偏移。',
      input:
        '基准时区、基准日期时间，以及需要对照的目标时区列表。默认可从常用 IANA 时区中选择，例如 Asia/Shanghai、America/New_York、Europe/London、Asia/Tokyo 等。用户可以添加多个目标时区，也可以删除暂时不需要查看的时区。',
      output:
        '每个目标时区对应的本地日期时间、时区名称和相对 UTC 的小时偏移。结果会随着基准时间、基准时区或目标时区列表变化而立即更新，帮助快速判断会议是否落在工作时间、发布是否跨日、以及不同地区之间的时差。',
      processing:
        '基于 dayjs 的 timezone 能力在浏览器内解析基准时间，并按 IANA 时区数据库规则转换到目标时区。夏令时、UTC 偏移和跨日日期由时区库统一处理，页面只负责组织输入状态和渲染结果。整个换算流程本地执行，不需要提交日程信息。',
      modes: ['基准时区设置', '当前时间填充', '多目标时区', 'UTC 偏移显示', '跨日对照'],
      example: {
        title: '跨时区换算示例',
        input: '基准: Asia/Shanghai\n时间: 2026-05-21 09:00\n目标: America/New_York, Europe/London',
        output: 'New York: 2026-05-20 21:00\nLondon: 2026-05-21 02:00',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Time Zone Converter maps one base time to multiple target time zones. It is useful for remote meeting scheduling, cross-border operations shifts, overseas release-window checks, support coverage planning, and verifying whether dates roll over between cities. The tool lets you choose a base time zone and time, fill the current time with one click, and view local times plus UTC offsets for multiple target zones side by side.',
      input:
        'A base time zone, a base date and time, and a list of target time zones to compare. Common IANA zones are available, such as Asia/Shanghai, America/New_York, Europe/London, and Asia/Tokyo. You can add several target zones and remove zones that are no longer needed.',
      output:
        'The local date and time, time zone name, and UTC offset for each target time zone. Results update immediately when the base time, base zone, or target list changes, making it easy to see whether a meeting lands in working hours, a release crosses into another date, or how large the time difference is between regions.',
      processing:
        'Uses dayjs timezone support in the browser to parse the base time and convert it according to IANA time zone rules. Daylight saving time, UTC offsets, and date rollovers are handled by the timezone library while the page manages state and display. The conversion stays local and does not submit schedule data.',
      modes: ['Base timezone', 'Use current time', 'Multiple target zones', 'UTC offset display', 'Date rollover check'],
      example: {
        title: 'Time zone conversion example',
        input: 'Base: Asia/Shanghai\nTime: 2026-05-21 09:00\nTargets: America/New_York, Europe/London',
        output: 'New York: 2026-05-20 21:00\nLondon: 2026-05-21 02:00',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'archive-converter': {
    zh: {
      summary:
        '压缩包转换工具用于在浏览器中打包文件为 ZIP，或解析 ZIP 压缩包并导出内部文件。适合临时整理多份资料、将前端资源打包交付、检查收到的 ZIP 内容、从压缩包中提取单个文件，以及在不安装桌面软件的情况下完成轻量归档处理。文件会进入本地处理队列，打包和解包过程不需要上传到服务器。',
      input:
        '普通文件列表或 ZIP 压缩包文件。用户可以拖拽多个文件到工具区，也可以点击选择文件；当输入 ZIP 文件时，工具会读取压缩包目录并允许查看或提取内部条目；当输入普通文件时，工具会将它们作为待打包队列。',
      output:
        '打包模式下输出一个新的 ZIP 文件，包含队列中的所有文件；解包模式下可导出压缩包内的单个文件或批量下载解析出的内容。文件列表会显示名称、大小和可执行操作，便于确认打包范围或清理误选文件。',
      processing:
        '基于 JSZip 在浏览器端读取文件对象、生成 ZIP 数据或解析 ZIP 条目。打包时逐个加入队列文件并生成 Blob 下载；解包时读取压缩包目录并按用户操作生成对应文件下载。处理过程只使用浏览器 File API 和内存数据，不会上传文件内容。',
      modes: ['多文件打包', 'ZIP 解包', '单文件提取', '队列清理', '本地文件处理'],
      example: {
        title: '压缩包处理示例',
        input: '文件队列: report.pdf, cover.png, data.csv\n操作: 打包为 ZIP',
        output: '下载 archive.zip，包含 3 个队列文件。',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Archive Converter packages files into ZIP archives or reads ZIP archives and exports their contents directly in the browser. It is useful for temporarily organizing multiple assets, delivering frontend resources as one archive, inspecting a received ZIP file, extracting a single file from an archive, and handling light archive tasks without installing desktop software. Files are processed in a local queue and are not uploaded to a server.',
      input:
        'A list of regular files or a ZIP archive. You can drag multiple files into the tool area or select them manually. When the input is a ZIP file, the tool reads the archive directory and lets you inspect or extract entries. When the input is regular files, they become the queue for creating a new archive.',
      output:
        'In packaging mode, the output is a new ZIP file containing all queued files. In extraction mode, you can export an individual file or download parsed archive contents. The file list displays names, sizes, and available actions so you can confirm the package scope or remove incorrect selections.',
      processing:
        'Uses JSZip in the browser to read File objects, generate ZIP data, or parse ZIP entries. Packaging adds queued files one by one and generates a downloadable Blob. Extraction reads the archive directory and produces the requested file downloads. Processing uses only the browser File API and memory data; file contents are never uploaded.',
      modes: ['Multi-file ZIP', 'ZIP extraction', 'Single file extract', 'Queue cleanup', 'Local file processing'],
      example: {
        title: 'Archive processing example',
        input: 'File queue: report.pdf, cover.png, data.csv\nAction: create ZIP',
        output: 'Download archive.zip containing the 3 queued files.',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'rmb-converter': {
    zh: {
      summary:
        '人民币大写转换工具用于将阿拉伯数字金额转换为规范的中文大写金额。适合财务报销单、合同金额栏、收据、借据、付款申请、发票备注和内部审批材料中的金额核对。用户输入数字后，工具会实时生成“元、角、分”格式的大写结果，减少手写金额时的错字、漏零和大小写不一致问题。',
      input:
        '需要转换的人民币数字金额，可以包含整数和两位小数，例如 1234.56、1000000 或 0.08。工具会对空值、非法字符、超过支持范围的金额进行提示，并提供常见金额快捷填充，便于快速测试或批量核对文档中的金额表达。',
      output:
        '符合中文财务书写习惯的大写金额文本，例如“壹仟贰佰叁拾肆元伍角陆分”。整数金额会以“整”结尾，小数金额按角分补齐；连续零、零元、零角等边界情况会按规则压缩，输出结果可直接复制到合同、报销或审批表单中。',
      processing:
        '在浏览器内将金额拆分为整数部分和小数部分，整数部分按万、亿等中文数位分组转换，小数部分按角、分处理。转换过程中会合并连续零、移除多余单位，并根据是否存在小数位决定是否追加“整”。所有校验和转换都在本地完成。',
      modes: ['数字金额输入', '中文大写输出', '角分处理', '整字规则', '一键复制结果'],
      example: {
        title: '人民币大写转换示例',
        input: '1234.56',
        output: '壹仟贰佰叁拾肆元伍角陆分',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The RMB Uppercase Converter turns numeric RMB amounts into formal Chinese uppercase currency text. It is useful for reimbursement forms, contract amount fields, receipts, IOUs, payment requests, invoice notes, and internal approval documents. After a number is entered, the tool generates the corresponding yuan/jiao/fen wording in real time, reducing mistakes such as missing zeros, wrong characters, and mismatched numeric and written amounts.',
      input:
        'A RMB numeric amount, optionally with up to two decimal places, such as 1234.56, 1000000, or 0.08. The tool validates empty values, invalid characters, and amounts beyond the supported range, and provides quick-fill amounts for testing or checking repeated document values.',
      output:
        'Formal Chinese uppercase RMB text, such as "壹仟贰佰叁拾肆元伍角陆分". Integer amounts end with "整", decimal amounts are rendered with jiao and fen, and edge cases such as repeated zeros, zero yuan, or zero jiao are compressed according to currency wording rules. The result can be copied directly into contracts, reimbursements, or approval forms.',
      processing:
        'Splits the amount into integer and decimal parts in the browser. The integer part is converted by Chinese digit groups such as wan and yi, while the decimal part is converted as jiao and fen. During conversion, consecutive zeros are merged, redundant units are removed, and "整" is appended only when appropriate. Validation and conversion remain local.',
      modes: ['Numeric amount input', 'Chinese uppercase output', 'Jiao/fen handling', 'Integer ending rule', 'One-click copy'],
      example: {
        title: 'RMB uppercase conversion example',
        input: '1234.56',
        output: '壹仟贰佰叁拾肆元伍角陆分',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'ppi-calculator': {
    zh: {
      summary:
        'PPI 计算器用于根据屏幕横向像素、纵向像素和对角线尺寸计算像素密度。适合比较手机、平板、显示器和笔记本屏幕清晰度，评估设计稿在不同设备上的显示精细程度，检查截图或素材的目标设备匹配度，以及理解 Retina、高分屏和普通屏之间的差异。输入三个参数后即可得到每英寸像素数量。',
      input:
        '屏幕宽度像素、高度像素和对角线英寸数。可以手动输入任意设备参数，也可以使用页面内置的常见设备预设快速填充。像素值代表物理分辨率，对角线尺寸以英寸为单位，例如 1920 x 1080、15.6 英寸。',
      output:
        '计算得到的 PPI 数值，以及根据像素密度给出的清晰度等级提示。较高 PPI 表示同样物理尺寸内像素更密集，视觉上更细腻；较低 PPI 在近距离观看时更容易看到像素颗粒。结果适合作为设备对比和设计适配参考。',
      processing:
        '先根据勾股定理计算屏幕像素对角线：sqrt(width² + height²)，再除以物理对角线英寸数得到 PPI。页面根据结果区间展示清晰度评级。所有计算都在前端同步完成，只依赖用户输入的分辨率和尺寸。',
      modes: ['宽高像素输入', '对角线尺寸输入', '常见设备预设', 'PPI 结果', '清晰度评级'],
      example: {
        title: 'PPI 计算示例',
        input: '宽度: 1920 px\n高度: 1080 px\n对角线: 15.6 in',
        output: 'PPI ≈ 141.21',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The PPI Calculator computes screen pixel density from horizontal pixels, vertical pixels, and diagonal size. It is useful for comparing the sharpness of phones, tablets, monitors, and laptops, evaluating how detailed a design will appear on different devices, checking whether screenshots or assets match a target device, and understanding the difference between Retina, high-density, and regular displays. Enter the three values to get pixels per inch.',
      input:
        'Screen width in pixels, height in pixels, and diagonal size in inches. You can enter custom device values or use the built-in common-device presets. Pixel values represent the physical resolution, and diagonal size is measured in inches, such as 1920 x 1080 at 15.6 inches.',
      output:
        'The calculated PPI value plus a density rating. A higher PPI means more pixels in the same physical area and a visually sharper display; a lower PPI is more likely to show visible pixel structure at close viewing distances. The result is useful as a reference for device comparison and design adaptation.',
      processing:
        'First calculates the screen pixel diagonal using the Pythagorean formula sqrt(width² + height²), then divides it by the physical diagonal size in inches to get PPI. The page maps the result to a density rating. All calculation is synchronous on the frontend and depends only on the entered resolution and size.',
      modes: ['Width/height pixels', 'Diagonal size', 'Device presets', 'PPI result', 'Sharpness rating'],
      example: {
        title: 'PPI calculation example',
        input: 'Width: 1920 px\nHeight: 1080 px\nDiagonal: 15.6 in',
        output: 'PPI ≈ 141.21',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },
};
