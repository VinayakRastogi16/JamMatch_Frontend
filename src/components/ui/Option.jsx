const Option = ({ icon, title, desc, options }) => {
  const Icon = icon;

  return (
    <div>
      <div className="border rounded-xl p-5 sm:p-6 bg-[#1B191B]/60 backdrop-blur-md">

        {/* Header */}
        <div className="flex items-center gap-4 mb-5">

          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-[#F68523]" />
          </div>

          <div>
            <h1 className="font-heading text-base font-bold text-foreground">
              {title}
            </h1>

            <p className="text-sm text-muted-foreground">
              {desc}
            </p>
          </div>

        </div>

        {/* Options */}
        <div className="space-y-2">

          {options.map((option) => (

            <div
              key={option.id}
              className="flex items-center justify-between py-3 border-t"
            >

              {/* Option information */}
              <div>
                <span className="text-sm font-medium">
                  {option.title}
                </span>

                {option.desc && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {option.desc}
                  </p>
                )}
              </div>

              {/* =========================
                  TOGGLE
              ========================== */}

              {option.type === "toggle" && (
                <button
                  type="button"
                  onClick={() =>
                    option.onChange(!option.value)
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    option.value
                      ? "bg-[#F68523]"
                      : "bg-gray-700"
                  }`}
                >

                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      option.value
                        ? "translate-x-0"
                        : "-translate-x-5"
                    }`}
                  />

                </button>
              )}

              {/* =========================
                  SELECT
              ========================== */}

              {option.type === "select" && (
                <select
                  value={option.value}
                  onChange={(e) =>
                    option.onChange(e.target.value)
                  }
                  className="bg-[#1B191B] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                >

                  {option.values.map((value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  ))}

                </select>
              )}

              {/* =========================
                  SLIDER
              ========================== */}

              {option.type === "slider" && (
                <div className="flex items-center gap-3">

                  <input
                    type="range"
                    min={option.min}
                    max={option.max}
                    value={option.value}
                    onChange={(e) =>
                      option.onChange(
                        Number(e.target.value)
                      )
                    }
                    className="w-80 accent-[#F68523] flex-row"
                  />

                  <span className="text-sm w-10 text-right">
                    {option.value} km
                  </span>

                </div>
              )}

            </div>

          ))}

        </div>

      </div>
    </div>
  );
};

export default Option;